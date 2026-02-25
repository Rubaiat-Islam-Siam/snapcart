"use client"
import { RootState } from "@/src/redux/store";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getSocket } from "@/src/lib/socket";
import dynamic from "next/dynamic";
import { IOder } from "@/src/models/order.model";
import { IMessage } from "@/src/models/message.model";
import { motion, AnimatePresence } from "framer-motion";

const LiveMap = dynamic(() => import("@/src/Components/LiveMap"), { ssr: false });

interface ILocation {
    longitude: number
    latitude: number
}

function TrackOrder({ params }: { params: { orderId: string } }) {
    const { orderId } = useParams() as { orderId: string }
    const { userData } = useSelector((state: RootState) => state.user)
    const [order, setOrder] = useState<IOder | null>(null)
    const router = useRouter()
    const [messages, setMessages] = useState<IMessage[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [newMessage, setNewMessage] = useState<string>("")
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

    useEffect(() => {
        const socket = getSocket()
        socket.emit("join-room", orderId)

        // Listen for incoming messages
        socket.on("sent-message", (message: IMessage) => {
            console.log("Received message:", message)
            if (message.roomId.toString() === orderId?.toString()) {
                setMessages((prev) => [...prev, message])
            }
        })

        return () => {
            socket.off("sent-message")
        }
    }, [orderId])

    // Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return

        const socket = getSocket()
        const message = {
            roomId: orderId,
            senderId: userData?._id?.toString(),
            text: newMessage,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        }
        socket.emit("send-message", message)
        setMessages((prev) => [...prev, message as unknown as IMessage])
        setNewMessage("")
    }

    useEffect(() => {
        const getAllMessage = async () => {
            try {
                const res = await axios.post("/api/chat/messages", { roomId: orderId })
                console.log("Loaded messages:", res.data)
                setMessages(res.data)
            } catch (error) {
                console.error("Error loading messages:", error)
            }
        }
        getAllMessage()
    }, [orderId])

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

                    <div className="bg-white rounded-3xl shadow-lg border flex flex-col h-[500px]">
                        <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-3xl">
                            <h3 className="text-lg font-bold text-gray-800">💬 Chat with Delivery Boy</h3>
                            <p className="text-xs text-gray-500 mt-1">Real-time messaging</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {messages?.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {messages?.map((msg) => {
                                        // Handle both populated and non-populated senderId
                                        const messageSenderId = typeof msg.senderId === 'object' && msg.senderId._id
                                            ? msg.senderId._id.toString()
                                            : msg.senderId.toString()
                                        const isMyMessage = messageSenderId === userData?._id?.toString()

                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                key={msg._id?.toString()}
                                                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`px-4 py-3 max-w-[80%] rounded-2xl shadow-md 
                                                            ${isMyMessage ? "bg-green-600 text-white rounded-br-none" : "bg-white rounded-bl-none text-gray-800 border"}`}>
                                                    <p className="text-sm font-medium break-words">{msg.text}</p>
                                                    <p className="text-[11px] opacity-70 mt-1 text-right">{msg.time}</p>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="flex gap-3 p-4 border-t bg-white rounded-b-3xl">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="bg-gray-50 px-4 py-3 flex-1 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;