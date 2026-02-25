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
    <div className="w-full h-[520px] rounded-3xl overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-100 shadow-2xl">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">
                Loading live tracking...
            </p>
        </div>
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
    const linePosition: [number, number][] | null = deliveryBoyLocation && deliveryBoyLocation.latitude !== 0 && deliveryBoyLocation.longitude !== 0 ? [
        [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        [userLocation.latitude, userLocation.longitude]
    ] : null
   return (
    <div className="w-full h-[520px] rounded-3xl overflow-hidden shadow-2xl relative group">

        {/* Live Badge */}
        <div className="absolute top-4 left-4 z-[999] bg-white/80 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-700">
                Live Tracking
            </span>
        </div>

        <MapContainer
            center={center as LatLngExpression}
            className="w-full h-full"
            zoom={13}
            scrollWheelZoom={true}
        >
            <Recenter position={center as [number, number]} />

            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={userIcon}
            >
                <Popup>User Location</Popup>
            </Marker>

            {deliveryBoyLocation &&
                deliveryBoyLocation.latitude !== 0 &&
                deliveryBoyLocation.longitude !== 0 && (
                    <Marker
                        position={[
                            deliveryBoyLocation.latitude,
                            deliveryBoyLocation.longitude,
                        ]}
                        icon={deliveryBoyIcon}
                    >
                        <Popup>Delivery Boy Location</Popup>
                    </Marker>
                )}

            {linePosition && (
                <Polyline
                    positions={linePosition as unknown as LatLngExpression[]}
                    color="#10b981"
                    weight={4}
                    opacity={0.9}
                />
            )}
        </MapContainer>
    </div>
)
}

export default LiveMap;