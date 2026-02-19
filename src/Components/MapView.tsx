"use client"
import { LatLngExpression } from "leaflet"
import { MapContainer, TileLayer } from "react-leaflet"


function MapView({ position }: { position: [number, number] | null }) {
    if(!position) return null
    return (
        <MapContainer center={position as LatLngExpression} className="w-full h-full" zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default MapView