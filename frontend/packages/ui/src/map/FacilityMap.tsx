import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef, type ReactNode } from "react";

import type { WaitTone } from "../components/FacilityRow";
import { cx } from "../utils/cx";

export type PinKind = "post" | "centre" | "hospital" | "clinic";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  kind: PinKind;
  /** Wait level colours the pin; `null` when the live wait is unknown. */
  load: WaitTone | null;
  /** Accessible name of the pin, e.g. "Kimironko Health Center, 6 waiting". */
  label: string;
}

export interface FacilityMapProps {
  points: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** The person's position after "Near me" (kept in the browser only). */
  you?: { lat: number; lng: number } | null;
  /** Tile URL template, e.g. `https://tile.openstreetmap.org/{z}/{x}/{y}.png` (OD-3). */
  tilesUrl: string;
  attribution: string;
  /** Accessible name of the map region. */
  label: string;
  /** The compact card of the selected place, shown over the map (a bottom sheet on phones). */
  card?: ReactNode;
  className?: string;
}

/** Rwanda, for the first view before any point is known. */
const RWANDA: L.LatLngBoundsExpression = [
  [-2.84, 28.86],
  [-1.05, 30.9],
];

function pinIcon(point: MapPoint, selected: boolean): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span class="ml-pin ml-pin--${point.kind} ml-pin--${point.load ?? "unknown"}${
      selected ? " ml-pin--selected" : ""
    }"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

/**
 * Map of places (upgrade 02 §3 `FacilityMap`): pins shaped by type and coloured by wait, "you" as
 * a blue dot, the selected place as a card. Loaded on its own (`@medilink/ui/map`) so tiles and
 * Leaflet arrive only when the map is shown. The list beside it is the keyboard alternative; pins
 * are focusable too.
 */
export default function FacilityMap({
  points,
  selectedId = null,
  onSelect,
  you = null,
  tilesUrl,
  attribution,
  label,
  card,
  className,
}: FacilityMapProps) {
  const node = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const select = useRef(onSelect);
  const fitted = useRef("");
  useEffect(() => {
    select.current = onSelect;
  });

  useEffect(() => {
    if (!node.current) return;
    const instance = L.map(node.current, { zoomControl: true, attributionControl: true });
    instance.fitBounds(RWANDA);
    L.tileLayer(tilesUrl, { attribution, maxZoom: 18 }).addTo(instance);
    instance.on("click", () => select.current?.(null));
    layer.current = L.layerGroup().addTo(instance);
    map.current = instance;
    // a new map starts on all of Rwanda: let the pins effect fit it to the places again
    fitted.current = "";
    return () => {
      instance.remove();
      map.current = null;
      layer.current = null;
    };
  }, [tilesUrl, attribution]);

  // Pins: redrawn when the places or the selection change; the view fits the places once per set.
  useEffect(() => {
    const group = layer.current;
    const instance = map.current;
    if (!group || !instance) return;
    group.clearLayers();
    for (const point of points) {
      L.marker([point.lat, point.lng], {
        icon: pinIcon(point, point.id === selectedId),
        title: point.label,
        alt: point.label,
        keyboard: true,
        riseOnHover: true,
        zIndexOffset: point.id === selectedId ? 1000 : 0,
      })
        .on("click", (event) => {
          L.DomEvent.stopPropagation(event);
          select.current?.(point.id);
        })
        .on("keypress", (event) => {
          const { key } = event.originalEvent;
          if (key === "Enter" || key === " ") select.current?.(point.id);
        })
        .addTo(group);
    }
    if (you) {
      L.marker([you.lat, you.lng], {
        icon: L.divIcon({
          className: "",
          html: '<span class="ml-pin-you"></span>',
          iconSize: [18, 18],
        }),
        keyboard: false,
        interactive: false,
      }).addTo(group);
    }
    const key = points.map((p) => p.id).join() + (you ? `|${you.lat},${you.lng}` : "");
    if (key !== fitted.current && (points.length || you)) {
      fitted.current = key;
      const bounds = L.latLngBounds(points.map((p): L.LatLngTuple => [p.lat, p.lng]));
      if (you) bounds.extend([you.lat, you.lng]);
      instance.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 });
    }
    // tilesUrl and attribution: a recreated map needs its pins and its fit again
  }, [points, selectedId, you, tilesUrl, attribution]);

  return (
    <div
      className={cx(
        "relative isolate overflow-hidden rounded-3xl bg-subtle shadow-card",
        className,
      )}
    >
      <div ref={node} role="region" aria-label={label} className="absolute inset-0" />
      {card && (
        // keyed by the place, so each newly selected card rises into view (upgrade 02 §6)
        <div
          key={selectedId}
          className="absolute inset-x-3 bottom-3 z-[1000] animate-rise rounded-2xl bg-surface p-4 shadow-raised"
        >
          {card}
        </div>
      )}
    </div>
  );
}
