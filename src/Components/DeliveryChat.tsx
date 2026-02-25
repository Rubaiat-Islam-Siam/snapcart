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
        <div className="bg-white rounded-3xl shadow-lg border flex flex-col h-[500px]">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-3xl">
                <h3 className="text-lg font-bold text-gray-800">💬 Chat with Customer</h3>
                <p className="text-xs text-gray-500 mt-1">Real-time messaging</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages?.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    <>
                        <AnimatePresence>
                            {messages?.map((msg) => {
                                // Handle both populated and non-populated senderId
                                const messageSenderId = typeof msg.senderId === 'object' && msg.senderId._id
                                    ? msg.senderId._id.toString()
                                    : msg.senderId.toString()
                                const isDeliveryBoy = messageSenderId === deliveryBoyId?.toString()

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        key={msg._id?.toString()}
                                        className={`flex ${isDeliveryBoy ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`px-4 py-3 max-w-[80%] rounded-2xl shadow-md 
                                        ${isDeliveryBoy ? "bg-green-600 text-white rounded-br-none" : "bg-white rounded-bl-none text-gray-800 border"}`}>
                                            <p className="text-sm font-medium break-words">{msg.text}</p>
                                            <p className="text-[11px] opacity-70 mt-1 text-right">{msg.time}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </>
                )}
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
    );
}

export default DeliveryChat;