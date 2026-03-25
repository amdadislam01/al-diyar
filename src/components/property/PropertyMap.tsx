"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface PropertyMapProps {
    lat: number;
    lng: number;
}

export default function PropertyMap({ lat, lng }: PropertyMapProps) {
    const position: [number, number] = [lat, lng];

    return (
        <MapContainer 
            center={position} 
            zoom={35} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
            className="z-0"
        >
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />
            <Marker position={position} icon={icon} />
        </MapContainer>
    );
}
