import { useEffect, useRef, useState } from "react";
import { ExternalLink, Layers3, LocateFixed } from "lucide-react";
import type { Language } from "@/lib/riverpulse-i18n";
import { waterStations, type StationStatus, type WaterStation } from "@/components/real-water-map";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { google?: any; __rpGmapsInit?: () => void }
}

const colors: Record<StationStatus, string> = { normal: "#34d399", attention: "#fbbf24", risk: "#f87171", offline: "#94a3b8" };
let loader: Promise<void> | null = null;
function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.reject();
  if (window.google?.maps?.Map) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve, reject) => {
    window.__rpGmapsInit = () => resolve();
    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__rpGmapsInit&channel=${channel}`;
    s.async = true;
    s.onerror = () => { loader = null; reject(new Error("load")); };
    document.head.appendChild(s);
  });
  return loader;
}

export default function GoogleWaterMap({ language, stations = waterStations, selectedId, onSelect, className = "" }: {
  language: Language; stations?: WaterStation[]; selectedId?: string; onSelect: (s: WaterStation) => void; className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [satellite, setSatellite] = useState(false);

  useEffect(() => {
    let off = false;
    loadGoogleMaps().then(() => {
      if (off || !el.current || map.current) return;
      const g = window.google.maps;
      map.current = new g.Map(el.current, { center: { lat: 51.15, lng: 71.42 }, zoom: 12, clickableIcons: false, mapTypeControl: false, streetViewControl: false, fullscreenControl: true });
      setReady(true);
    }).catch(() => setError(true));
    return () => { off = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const g = window.google.maps;
    markers.current.forEach((m) => m.setMap(null));
    markers.current = stations.map((s) => {
      const m = new g.Marker({
        map: map.current, position: { lat: s.coordinates[1], lng: s.coordinates[0] }, title: s.waterBody[language] + " — " + s.name[language],
        icon: { path: g.SymbolPath.CIRCLE, scale: s.id === selectedId ? 11 : 8, fillColor: colors[s.status], fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 },
      });
      m.addListener("click", () => onSelect(s));
      return m;
    });
    if (stations.length > 1) {
      const b = new g.LatLngBounds();
      stations.forEach((s) => b.extend({ lat: s.coordinates[1], lng: s.coordinates[0] }));
      if (stations.length < waterStations.length) map.current.fitBounds(b, 60);
    }
  }, [ready, stations, selectedId, language, onSelect]);

  useEffect(() => { if (ready) map.current.setMapTypeId(satellite ? "hybrid" : "roadmap"); }, [ready, satellite]);

  function locate() {
    if (!navigator.geolocation || !map.current) return;
    navigator.geolocation.getCurrentPosition((p) => {
      const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      new window.google.maps.Marker({ map: map.current, position: pos });
      map.current.panTo(pos); map.current.setZoom(14);
    });
  }
  const sel = waterStations.find((s) => s.id === selectedId) || waterStations[0];
  return (
    <div className={"real-map " + className}>
      <div ref={el} className="real-map-canvas" />
      {error && <div className="rp-map-fallback"><span className="rp-fallback-note">Google Maps не загрузилась. Проверьте интернет.</span></div>}
      <div className="rp-map-controls">
        <button type="button" onClick={locate} aria-label="Моё местоположение"><LocateFixed size={18} /></button>
        <button type="button" className={satellite ? "active" : ""} aria-pressed={satellite} onClick={() => setSatellite((v) => !v)} aria-label="Спутник"><Layers3 size={18} /></button>
      </div>
      <a className="rp-google-map-link" href={`https://www.google.com/maps/search/?api=1&query=${sel.coordinates[1]},${sel.coordinates[0]}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Google Maps</a>
    </div>
  );
}
