import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/../lib/db";

export const runtime = "nodejs";           // wichtig für 'pg'
export const dynamic = "force-dynamic";    // keine statische Zwischenspeicherung

// GET /api/pois?bbox=minLon,minLat,maxLon,maxLat&category=school(optional)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bbox = (searchParams.get("bbox") || "").split(",").map(Number);
  const category = searchParams.get("category") || "%";

  if (bbox.length !== 4 || bbox.some(Number.isNaN)) {
    return NextResponse.json({ error: "bbox=minLon,minLat,maxLon,maxLat" }, { status: 400 });
  }
  const [minLon, minLat, maxLon, maxLat] = bbox;

  const sql = `
    SELECT id, name, category, ST_X(geom) AS lon, ST_Y(geom) AS lat
    FROM pois
    WHERE category ILIKE $1
      AND ST_Intersects(geom, ST_MakeEnvelope($2,$3,$4,$5,4326))
    LIMIT 1000
  `;
  const { rows } = await pool.query(sql, [category, minLon, minLat, maxLon, maxLat]);

  return NextResponse.json({
    type: "FeatureCollection",
    features: rows.map(r => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [r.lon, r.lat] },
      properties: { id: r.id, name: r.name, category: r.category }
    }))
  });
}
