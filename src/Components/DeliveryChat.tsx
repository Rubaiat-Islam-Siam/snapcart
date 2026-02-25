import { Send } from "lucide-react";
import mongoose from "mongoose";
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../lib/socket";
import { IMessage } from "../models/message.model";
import axios from "axios";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";

type Props = {
    orderId: mongoose.Types.ObjectId
    deliveryBoyId: mongoose.Types.ObjectId
}
function DeliveryChat({ orderId, deliveryBoyId }: Props) {
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState<IMessage[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const socket = getSocket()
        socket.emit("join-room", orderId.toString())

        // Listen for incoming messages
        socket.on("sent-message", (message: IMessage) => {
            console.log("Received message:", message)
            if (message.roomId.toString() === orderId.toString()) {
                setMessages((prev) => [...prev, message])
            }
        })

        return () => {
            socket.off("sent-message")
        }
    }, [orderId])

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return

        const socket = getSocket()
        const message = {
            roomId: orderId.toString(),
            senderId: deliveryBoyId?.toString(),
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

    // Auto-scroll to the bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-green-100 rounded-3xl shadow-2xl flex flex-col h-[520px] overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 bg-white/60 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                💬 Chat with Customer
            </h3>
            <p className="text-xs text-gray-500 mt-1">
                Real-time messaging
            </p>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/40 to-white/10">

            {messages?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No messages yet. Start the conversation!
                </div>
            ) : (
                <>
                    <AnimatePresence>
                        {messages?.map((msg) => {
                            const messageSenderId =
                                typeof msg.senderId === "object" &&
                                msg.senderId._id
                                    ? msg.senderId._id.toString()
                                    : msg.senderId.toString()

                            const isDeliveryBoy =
                                messageSenderId ===
                                deliveryBoyId?.toString()

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.25 }}
                                    key={msg._id?.toString()}
                                    className={`flex ${
                                        isDeliveryBoy
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`px-5 py-3 max-w-[75%] rounded-3xl text-sm shadow-lg transition-all duration-200 border-0
                                        ${
                                            isDeliveryBoy
                                                ? "bg-emerald-600 text-white rounded-br-md"
                                                : "bg-white text-gray-800 rounded-bl-md"
                                        }`}
                                    >
                                        <p className="break-words font-medium">
                                            {msg.text}
                                        </p>
                                        <p className="text-[11px] opacity-70 mt-2 text-right">
                                            {msg.time}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>

        {/* INPUT SECTION */}
        <div className="flex gap-3 p-5 bg-white/70 backdrop-blur-xl">
            <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-5 py-3 rounded-2xl bg-white shadow-inner text-sm border-none outline-none focus:outline-none focus:ring-0"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) =>
                    e.key === "Enter" && handleSendMessage()
                }
            />

            <button
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border-none outline-none disabled:opacity-40"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
            >
                <Send size={20} />
            </button>
        </div>
    </div>
)
}

export default DeliveryChat;