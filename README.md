# 🗺️ Immo-Map

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🏠 Intelligente Immobilien-Umgebungsanalyse mit interaktiver Kartendarstellung</h3>
  <p>Eine moderne Web-Anwendung zur Erkundung und Bewertung von Points of Interest (POIs) rund um Immobilienstandorte in Deutschland.</p>
</div>

---

## 📋 Inhaltsverzeichnis

- [✨ Features](#-features)
- [🚀 Demo](#-demo)
- [🛠️ Installation](#️-installation)
- [💡 Verwendung](#-verwendung)
- [🏗️ Architektur](#️-architektur)
- [📊 Datenquellen](#-datenquellen)
- [🎨 UI/UX](#-uiux)
- [🔧 Entwicklung](#-entwicklung)
- [📈 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 Lizenz](#-lizenz)

## ✨ Features

### 🎯 Kernfunktionalitäten
- **🗺️ Interaktive Kartendarstellung** mit React-Leaflet und OpenStreetMap
- **📍 Präzise POI-Suche** mit Deutschland-weiter Abdeckung über Overpass API
- **🎨 Farbkodierte Kategorien** für intuitive Visualisierung
- **🔍 Intelligente Ortssuche** mit Nominatim Geocoding
- **⚡ Performance-optimiert** mit manueller Suchsteuerung

### 📱 Benutzerfreundlichkeit
- **🎛️ Moderne UI** mit Tailwind CSS und responsivem Design
- **🏷️ 17+ POI-Kategorien** von Schulen bis Supermärkte
- **📊 Live-Statusanzeige** mit Ergebniszählern und Ladeanimationen
- **🎨 Custom Icon-System** mit Emoji-basierten, farbkodierten Markern
- **📄 Detaillierte Popup-Infos** mit Adressen, Öffnungszeiten und Links

### 🔧 Technische Highlights
- **⚡ Next.js 15** mit App Router und Turbopack
- **🔒 TypeScript** für Typsicherheit
- **🌐 SSR-kompatibel** mit dynamischen Imports
- **🚀 Optimierte API-Calls** mit intelligenter Deutschland-Filterung
- **💾 State Management** mit React Hooks

## 🚀 Demo

```bash
# Schnellstart
npm install
npm run dev
# → http://localhost:3000
```

**Beispiel-Workflow:**
1. 🔍 Suche nach "Berlin Mitte" 
2. 🏷️ Wähle Kategorien (Schulen, Supermärkte, Apotheken)
3. 🎯 Klicke "Hier suchen"
4. 📊 Erkunde 50+ POIs mit detaillierten Informationen

## 🛠️ Installation

### Voraussetzungen
- Node.js 18+ 
- npm, yarn, pnpm oder bun

### Setup
```bash
# Repository klonen
git clone https://github.com/Leon510/immo-map.git
cd immo-map

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Build für Produktion
```bash
npm run build
npm start
```

## 💡 Verwendung

### 1. Standort suchen
```typescript
// Nutze die PlaceSearch-Komponente
<PlaceSearch onSelect={(bbox) => flyToBbox(bbox)} />
```

### 2. Kategorien auswählen
- **🏫 Bildung**: Schulen, Universitäten, Kindergärten
- **🏥 Gesundheit**: Krankenhäuser, Apotheken, Ärzte  
- **🛒 Einkaufen**: Supermärkte, Bäckereien, Friseure
- **🏦 Finanzen**: Banken, Geldautomaten
- **🚔 Öffentlich**: Polizei, Feuerwehr, Post
- **🌳 Freizeit**: Parks, Fitness, Spielplätze

### 3. Ergebnisse erkunden
```typescript
// Detaillierte POI-Informationen
{
  name: "Grundschule Musterstraße",
  category: "school",
  school_type: "grundschule", 
  address: "Musterstraße 123, 10115 Berlin",
  coordinates: [52.5200, 13.4050]
}
```

## 🏗️ Architektur

### Frontend-Stack
```
├── 🖥️ Next.js 15 (App Router)
├── ⚛️ React 18 + TypeScript  
├── 🗺️ React-Leaflet + Leaflet.js
├── 🎨 Tailwind CSS
└── 🔧 Custom Hooks & Components
```

### API-Layer
```
├── 📡 /api/osm - Overpass API Proxy
├── 🔍 Deutschland-Filterung (Area ID: 3600051477)
├── 📊 Multi-Tag-Queries für bessere Abdeckung
└── ⚡ Performance-optimierte Anfragen
```

### Komponenten-Struktur
```
src/
├── app/
│   ├── components/
│   │   ├── PlaceSearch.tsx      # 🔍 Geocoding & Ortssuche
│   │   ├── CategoryPicker.tsx   # 🏷️ Kategorienauswahl + Suchbutton
│   │   ├── LoadingOverlay.tsx   # ⏳ Ladeanzeigen
│   │   ├── StatusBar.tsx        # 📊 Ergebnisstatistiken
│   │   └── MapLegend.tsx        # 🎨 Kategorien-Legende
│   ├── utils/
│   │   └── poiIcons.ts          # 🎨 Icon-System & Farbkodierung
│   └── api/
│       └── osm/route.ts         # 🌐 Overpass API Integration
```

## 📊 Datenquellen

### 🗺️ OpenStreetMap (Overpass API)
- **Abdeckung**: Vollständige Deutschland-Daten
- **Update-Frequenz**: Echtzeit-Synchronisation  
- **Datenqualität**: Community-gepflegt, hoch qualitativ
- **API-Limit**: Faire Nutzungsrichtlinien

### 🔍 Nominatim Geocoding
- **Suchbereich**: Global mit Deutschland-Fokus
- **Präzision**: Straßen-/Hausnummer-genau
- **Sprache**: Deutsch & Englisch

### Tag-Mapping Beispiel
```typescript
const TAG_MAP = {
  school: [
    'amenity="school"',           // Haupttag für Schulen
    'amenity="university"',       // Universitäten
    'building="school"',          // Schulgebäude
    'amenity="kindergarten"'      // Kindergärten
  ]
};
```

## 🎨 UI/UX

### Design-Prinzipien
- **🎯 Nutzerorientiert**: Klare Workflows, minimale Klicks
- **🎨 Visuell intuitiv**: Farbkodierung, Emoji-Icons, moderne Typography  
- **📱 Responsive**: Desktop, Tablet & Mobile optimiert
- **⚡ Performance**: Lazy Loading, optimierte Animationen

### Farbsystem
```typescript
const POI_STYLES = {
  school: { color: "#3b82f6", icon: "🏫", bgColor: "#dbeafe" },
  hospital: { color: "#dc2626", icon: "🏥", bgColor: "#fee2e2" },
  supermarket: { color: "#ea580c", icon: "🛒", bgColor: "#fed7aa" }
};
```

### Animationen
- **🔄 Micro-Interactions**: Button Hovers, Loading Spinner
- **🎭 State Transitions**: Smooth Loading States  
- **📍 Map Animations**: Fly-to Effekte, Marker Clustering

## 🔧 Entwicklung

### Scripts
```bash
npm run dev      # 🔥 Development Server
npm run build    # 📦 Production Build  
npm run start    # 🚀 Production Server
npm run lint     # 🔍 Code Linting
```

### Umgebungsvariablen
```env
# Keine externen APIs - alles über öffentliche Dienste
# Optional: Rate Limiting, Analytics
NEXT_PUBLIC_MAP_CENTER="52.5200,13.4050"
```

### Development Workflow
1. 🌿 Feature Branch erstellen
2. 🔧 Entwickeln mit Hot Reload  
3. ✅ TypeScript & Linting prüfen
4. 🧪 Funktionale Tests
5. 🚀 Build & Deploy

## 📈 Roadmap

### 🚀 V2.0 - Enhanced Features
- [ ] **👤 User Accounts** mit gespeicherten Favoriten
- [ ] **📊 Advanced Filtering** (Entfernung, Bewertungen, Öffnungszeiten)
- [ ] **🔔 Standort-Alerts** bei neuen POIs
- [ ] **📱 PWA Support** für Offline-Nutzung

### 🎯 V2.5 - Analytics & Insights  
- [ ] **📈 POI-Dichte Heatmaps**
- [ ] **🚶 Walkability Scores** 
- [ ] **🚌 ÖPNV-Integration**
- [ ] **💰 Immobilienpreis-Korrelationen**

### 🌟 V3.0 - AI & Predictions
- [ ] **🤖 ML-basierte POI-Empfehlungen**
- [ ] **📊 Neighborhood Scoring**
- [ ] **🔮 Future Development Predictions**

## 🤝 Contributing

Wir freuen uns über Contributions! 🎉

### Wie beitragen?
1. 🍴 Fork das Repository
2. 🌿 Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. 💾 Changes committen (`git commit -m 'Add amazing feature'`)
4. 🚀 Branch pushen (`git push origin feature/amazing-feature`) 
5. 📬 Pull Request öffnen

### Entwicklungsrichtlinien
- ✅ TypeScript für alle neuen Features
- 🎨 Tailwind CSS für Styling
- 📝 Aussagekräftige Commit Messages
- 🧪 Tests für neue Funktionalitäten

## 📄 Lizenz

Dieses Projekt steht unter der **MIT Lizenz**. Siehe [LICENSE](LICENSE) für Details.

---

<div align="center">
  <p>Entwickelt mit ❤️ für die deutsche Immobilienbranche</p>
  <p>
    <a href="#top">⬆️ Nach oben</a> •
    <a href="https://github.com/Leon510/immo-map/issues">🐛 Bug melden</a> •  
    <a href="https://github.com/Leon510/immo-map/discussions">💬 Diskussion</a>
  </p>
</div>
