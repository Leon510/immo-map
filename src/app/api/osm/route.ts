import { NextRequest, NextResponse } from "next/server";

const TAG_MAP: Record<string, string[]> = {
  school: [
    'amenity="school"',              
    'amenity="university"',             
    'amenity="college"',                  
    'building="school"',                 
    'amenity="kindergarten"',             
    'amenity="music_school"',             
    'amenity="language_school"',          
    'amenity="driving_school"',           
    'office="educational_institution"'    
  ],
  kindergarten: ['amenity="kindergarten"', 'amenity="childcare"'],
  hospital: ['amenity="hospital"', 'healthcare="hospital"', 'building="hospital"'],
  pharmacy: ['amenity="pharmacy"', 'healthcare="pharmacy"'],
  bank: ['amenity="bank"'],
  atm: ['amenity="atm"'],
  post: ['amenity="post_office"', 'amenity="post_depot"'],
  police: ['amenity="police"'],
  fire: ['amenity="fire_station"'],
  // shop
  supermarket: ['shop="supermarket"', 'shop="convenience"'],
  bakery: ['shop="bakery"'],
  hairdresser: ['shop="hairdresser"', 'shop="beauty"'],
  // health  
  doctor: ['healthcare="doctor"', 'amenity="doctors"', 'amenity="clinic"'],
  dentist: ['healthcare="dentist"', 'amenity="dentist"'],
  // leisure
  park: ['leisure="park"', 'landuse="recreation_ground"'],
  gym: ['leisure="fitness_centre"', 'leisure="sports_centre"', 'amenity="gym"'],
  playground: ['leisure="playground"'],
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;
  const bbox = (sp.get("bbox") || "").split(",").map(Number);
  const cats = (sp.get("cat") || "school").split(",").map(s => s.trim()).filter(Boolean);

  if (bbox.length !== 4 || bbox.some(Number.isNaN)) {
    return NextResponse.json({ error: "bbox=minLon,minLat,maxLon,maxLat" }, { status: 400 });
  }
  
  const allFilters: string[] = [];
  cats.forEach(cat => {
    const tagVariants = TAG_MAP[cat];
    if (tagVariants) {
      allFilters.push(...tagVariants);
    }
  });
  
  if (!allFilters.length) return NextResponse.json({ type:"FeatureCollection", features: [] });

  // Deutschland area ID für geografische Beschränkung
  const germanyAreaId = "3600051477"; 

  const overpass = `
    [out:json][timeout:30];
    area(id:${germanyAreaId})->.germany;
    (
      ${allFilters.map(filter => 
        `node[${filter}](area.germany)(${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});`
      ).join("\n      ")}
      ${allFilters.map(filter => 
        `way[${filter}](area.germany)(${bbox[1]},${bbox[0]},${bbox[3]},${bbox[2]});`
      ).join("\n      ")}
    );
    out center tags;
  `.trim();

  console.log(`🔍 Searching for: ${cats.join(", ")} in bbox: ${bbox.join(",")}`);
  console.log(`📊 Total filters: ${allFilters.length}`);
  
  const r = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(overpass),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
  if (!r.ok) return NextResponse.json({ error: "overpass error" }, { status: 502 });
  const json = await r.json();
  
  console.log(`📍 Found ${json.elements?.length || 0} raw elements from Overpass`);

  const features = (json.elements || [])
    .filter((e: any) => (e.type === "node" && e.lat && e.lon) || (e.type === "way" && e.center))
    .map((e: any) => {
      const tags = e.tags || {};
      
      // Get coordinates (node vs way with center)
      const lat = e.lat || e.center?.lat;
      const lon = e.lon || e.center?.lon;
      if (!lat || !lon) return null;
      
      // Determine primary category from tags
      let category = "unknown";
      let subcategory = "";
      
      if (tags.amenity) {
        category = tags.amenity;
        // Special handling for schools
        if (tags.amenity === "school" && tags.school) {
          subcategory = tags.school;
        }
      } else if (tags.shop) {
        category = tags.shop;
      } else if (tags.healthcare) {
        category = tags.healthcare;
      } else if (tags.leisure) {
        category = tags.leisure;
      } else if (tags.building === "school") {
        category = "school";
      } else if (tags.office === "educational_institution") {
        category = "educational_institution";
      }
      
      // Enhanced name detection with fallbacks
      let name = tags.name || tags.brand || tags["name:de"] || tags["official_name"];
      
      // Smart naming for schools based on type
      if (!name || name === "Schule") {
        if (tags.amenity === "school") {
          const schoolTypes: Record<string, string> = {
            "primary": "Grundschule",
            "secondary": "Weiterführende Schule", 
            "gymnasium": "Gymnasium",
            "realschule": "Realschule",
            "hauptschule": "Hauptschule",
            "gesamtschule": "Gesamtschule",
            "grundschule": "Grundschule",
            "oberschule": "Oberschule",
            "mittelschule": "Mittelschule",
            "förderschule": "Förderschule",
            "waldorfschule": "Waldorfschule",
            "montessori": "Montessori-Schule"
          };
          
          if (tags.school && schoolTypes[tags.school]) {
            name = schoolTypes[tags.school];
          } else if (tags.school) {
            name = `Schule (${tags.school})`;
          } else {
            name = "Schule";
          }
        } else if (tags.amenity === "university") {
          name = tags.short_name || "Universität";
        } else if (tags.amenity === "kindergarten") {
          name = "Kindergarten";
        } else if (!name) {
          name = "(unbenannt)";
        }
      }
      
      // Add school type to name if it's a named school
      if (tags.amenity === "school" && tags.school && name && name !== "Schule") {
        const schoolTypes: Record<string, string> = {
          "gymnasium": "Gymnasium",
          "realschule": "Realschule", 
          "hauptschule": "Hauptschule",
          "gesamtschule": "Gesamtschule",
          "grundschule": "Grundschule"
        };
        
        const schoolType = schoolTypes[tags.school];
        if (schoolType && !name.toLowerCase().includes(schoolType.toLowerCase())) {
          name = `${name} (${schoolType})`;
        }
      }
      
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: {
          id: String(e.id),
          name: name,
          category: category,
          subcategory: subcategory,
          amenity: tags.amenity,
          shop: tags.shop,
          healthcare: tags.healthcare,
          leisure: tags.leisure,
          school_type: tags.school,
          education_type: tags["isced:level"], // International Standard Classification of Education
          website: tags.website,
          phone: tags.phone,
          opening_hours: tags.opening_hours,
          address: {
            street: tags["addr:street"],
            housenumber: tags["addr:housenumber"], 
            postcode: tags["addr:postcode"],
            city: tags["addr:city"]
          },
          raw: tags
        }
      };
    })
    .filter(Boolean); // Remove null entries
    
  console.log(`✅ Processed to ${features.length} valid features`);

  return NextResponse.json({ type: "FeatureCollection", features });
}
