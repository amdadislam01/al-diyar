"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

export default function ContactMap() {
    const [isMounted, setIsMounted] = useState(false);
    const officeLocation: [number, number] = [23.7925, 90.4078]; // Approx Gulshan-2, Dhaka

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">Loading Map...</div>;
    }

    return (
        <MapContainer center={officeLocation} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={officeLocation} icon={icon}>
                <Popup>
                    <div className="text-slate-900 font-bold p-1">
                        Al-Diyar Office
                        <br />
                        <span className="text-xs font-normal text-slate-600">Gulshan-2, Dhaka</span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
