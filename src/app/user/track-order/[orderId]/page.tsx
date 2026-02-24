"use client"
import { IUser } from "@/src/models/user.model";
import { RootState } from "@/src/redux/store";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import mongoose from "mongoose";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getSocket } from "@/src/lib/socket";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/src/Components/LiveMap"), { ssr: false });

interface IOder {
    _id: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; name: string }
    items: [{
        grocery: mongoose.Types.ObjectId
        name: string
        price: string
        unit: string
        image: string
        quantity: number
    }]
    isPaid: boolean
    totalAmount: number
    paymentMethod: "cod" | "online"
    address: {
        fullName: string
        mobile: string
        fulladdress: string
        city: string
        state: string
        pincode: string
        longitude: number
        latitude: number
    }
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy?: IUser
    status: "pending" | "out of delivery" | "delivered" | "cancelled"
    createdAt?: Date
    updatedAt?: Date
}

interface ILocation {
    longitude: number
    latitude: number
}

function TrackOrder({ params }: { params: { orderId: string } }) {
    const { orderId } = useParams()
    const { userData } = useSelector((state: RootState) => state.user)
    const [order, setOrder] = useState<IOder | null>(null)
    const router = useRouter()
    const [userLocation, setUserLocation] = useState<ILocation>(
        {
            longitude: 0,
            latitude: 0
        }
    )
    const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>(
        {
            longitude: 0,
            latitude: 0
        }
    )
    useEffect(() => {
        const getOrder = async () => {
            try {
                const result = await axios.get(`/api/user/get-order/${orderId}`)
                const data = await result.data
                setOrder(data.order)
                setUserLocation({
                    longitude: data.order.address.longitude,
                    latitude: data.order.address.latitude
                })
                setDeliveryBoyLocation({
                    longitude: data.order.assignedDeliveryBoy.location.coordinates[0],
                    latitude: data.order.assignedDeliveryBoy.location.coordinates[1]
                })
            } catch (error) {
                console.log(error)
            }
        }
        getOrder()
    }, [userData?._id])
    useEffect(() => {
        const socket = getSocket()
        socket.on("update-deliveryBoy-location", ({ userId, location }: { userId: string, location: ILocation }) => {
            if (userId.toString() === order?.assignedDeliveryBoy?._id?.toString()) {
                setDeliveryBoyLocation({
                    latitude: location.latitude,
                    longitude: location.longitude
                })
            }
        })
        return () => {
            socket.off("update-deliveryBoy-location")
        }
    }, [order])
    return (
        <div className="w-full min-h-screen bg-linear-to-b from-green-50 via-white to-white"   >
            <div className="max-w-2xl mx-auto pb-24">
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow gap-3 flex items-center z-999">
                    <button className="p-2 rounded-full bg-green-100" onClick={() => router.back()}><ArrowLeft className="text-green-700" size={20} /> </button>
                    <div>
                        <h2 className="font-bold text-xl">Track Order</h2>
                        <p className="text-gray-500 text-xs">Order ID: #{order?._id?.toString().slice(-6)} <span className="capitalize text-green-600 font-semibold">{order?.status}</span></p>
                    </div>

                </div>
                <div className="mt-10 px-4">
                    <div className="rounded-3xl overflow-hidden border shadow">
                        <LiveMap
                            userLocation={userLocation}
                            deliveryBoyLocation={deliveryBoyLocation}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;