"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, CircleMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

import type { OfficePlace } from "@/lib/sharedOfficeModel";

/**
 * 공유 오피스 위치 지도 (Leaflet + OpenStreetMap).
 *
 * Leaflet 은 브라우저의 window 가 있어야 동작하므로, 화면이 뜬 뒤에 불러옵니다.
 * 받은 목록이 바뀌면 점을 새로 찍고, 모든 점이 보이도록 지도 범위를 맞춥니다.
 * 목록에서 고른 곳(activeId)은 지도가 그 위치로 이동하며 이름표를 엽니다.
 */
export default function OfficeMap({
  offices,
  activeId,
  onSelect,
}: {
  offices: OfficePlace[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef(new Map<string, CircleMarker>());
  const libRef = useRef<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);

  // 지도 한 번 만들기
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (cancelled || !el.current) return;
      const L = mod.default ?? mod;
      libRef.current = L;
      const map = L.map(el.current, {
        center: [37.5, 127.03],
        zoom: 12,
        scrollWheelZoom: false, // 페이지를 스크롤하다 지도가 확대되지 않도록
        dragging: !L.Browser.mobile, // 휴대폰에서는 한 손가락 스크롤이 페이지를 내리도록
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // 목록이 바뀌면 점 다시 찍기
  useEffect(() => {
    const L = libRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;

    layer.clearLayers();
    markersRef.current.clear();

    for (const o of offices) {
      // 이름표 내용은 글자로만 넣어, 원본 데이터에 섞인 기호가 화면을 깨뜨리지 않게 합니다
      const box = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = o.name;
      const addr = document.createElement("div");
      addr.textContent = o.address;
      box.append(title, addr);

      const marker = L.circleMarker([o.lat, o.lng], {
        radius: 7,
        color: "#fffaf0",
        weight: 2,
        fillColor: "#ff4d8b",
        fillOpacity: 0.9,
      })
        .bindPopup(box, { className: "om-popup" })
        .on("click", () => onSelect(o.id))
        .addTo(layer);
      markersRef.current.set(o.id, marker);
    }

    if (offices.length > 0) {
      const bounds = L.latLngBounds(offices.map((o) => [o.lat, o.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
    }
  }, [offices, ready, onSelect]);

  // 고른 곳 강조
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    markersRef.current.forEach((m, id) => {
      const on = id === activeId;
      m.setStyle({ fillColor: on ? "#1a3a3a" : "#ff4d8b", radius: on ? 10 : 7 });
      if (on) {
        m.bringToFront();
        map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 15), { duration: 0.6 });
        m.openPopup();
      }
    });
  }, [activeId, ready]);

  return <div ref={el} className="om-map" role="region" aria-label="공유 오피스 위치 지도" />;
}
