"use client"
import L, { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"

interface ILocation {
    latitude: number
    longitude: number
}
interface IProps {
    userLocation: ILocation | null
    deliveryBoyLocation: ILocation | null
}

function Recenter({ position }: { position: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        if (position[0] !== 0 && position[1] !== 0) {
            map.setView(position, map.getZoom(), {
                animate: true,
            })
        }
    })

    return null
}

function LiveMap({ userLocation, deliveryBoyLocation }: IProps) {
    // Return null or loading state if userLocation is not available
    if (!userLocation || userLocation.latitude === 0 || userLocation.longitude === 0) {
        return (
            <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Loading map...</p>
            </div>
        )
    }

    const deliveryBoyIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
        iconSize: [40, 40],
    })
    const userIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
        iconSize: [40, 40],
    })
    const center = [userLocation.latitude, userLocation.longitude]
    const linePosition = deliveryBoyLocation && deliveryBoyLocation.latitude !== 0 && deliveryBoyLocation.longitude !== 0 ? [
        [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        [userLocation.latitude, userLocation.longitude]
    ] : null
    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative">
            <MapContainer center={center as LatLngExpression} className="w-full h-full" zoom={13} scrollWheelZoom={true}>
                <Recenter position={center as [number, number]} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}><Popup>User Location</Popup></Marker>
                {deliveryBoyLocation && deliveryBoyLocation.latitude !== 0 && deliveryBoyLocation.longitude !== 0 && (
                    <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}><Popup>Delivery Boy Location</Popup></Marker>
                )}
                {linePosition && (
                    <Polyline positions={linePosition as any} color="green" weight={2} opacity={1} />
                )}
            </MapContainer>
        </div>
    );
}

export default LiveMap;