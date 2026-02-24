"use client"
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Truck, UserCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getSocket } from "../lib/socket"
import { IOder } from "../models/order.model"
import { useRouter } from "next/navigation"
import Image from "next/image"

function UserOderCard({ order }: { order: IOder }) {
    const [expanded, setExpanded] = useState(false)
    const [status, setStatus] = useState(order.status)
    const route = useRouter()

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-200"
            case "out of delivery":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "delivered":
                return "bg-green-50 text-green-700 border-green-200"
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-200"
        }
    }

    useEffect(() => {
        const socket = getSocket()
        socket.on("order-status-update", (data: {
            orderId: string,
            status: "pending" | "out of delivery" | "delivered" | "cancelled"
        }) => {
            if (data.orderId == order._id.toString()) {
                setStatus(data.status)
            }
        })
        return () => {
            socket.off("order-status-update")
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
        >

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-green-50 via-white to-white">

                <div className="flex flex-col gap-1">
                    <h3 className="text-gray-800 font-semibold text-base sm:text-lg">
                        Order #
                        <span className="text-green-600 font-bold ml-1">
                            {order._id.toString().slice(-6)}
                        </span>
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm">
                        {new Date(order.createdAt || new Date()).toDateString()}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                    </span>

                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(status)}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* BODY */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

                {/* PAYMENT */}
                {order.paymentMethod == "cod"
                    ? (
                        <div className="flex items-center gap-3 text-gray-700 text-sm">
                            <Truck className="text-green-500" size={18} />
                            <span className="font-semibold text-sm sm:text-base">Cash on Delivery</span>
                        </div>
                    )
                    : (
                        <div className="flex items-center gap-3 text-gray-700 text-sm">
                            <CreditCard className="text-green-500" size={18} />
                            <span className="font-semibold text-sm sm:text-base">Online Payment</span>
                        </div>
                    )
                }

                {order.assignedDeliveryBoy && typeof order.assignedDeliveryBoy === 'object' && 'name' in order.assignedDeliveryBoy && <>
                    <div className="bg-blue-50 mt-4 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <UserCheck className="text-blue-600" size={18}/>
                            <div className="font-semibold text-gray-800">
                                <p>Assigned to: <span>{order.assignedDeliveryBoy.name}</span></p>
                                <p className="text-xs text-gray-600">📞 +88{order.assignedDeliveryBoy.mobile}</p>
                            </div>

                        </div>
                        <a href={`tel:${order.assignedDeliveryBoy.mobile}` } className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Call</a>
                    </div>
                
                <button className="w-full items-center justify-center flex gap-2 bg-green-600 text-white font-semibold hover:bg-green-700 rounded-xl shadow transition py-3" onClick={()=> route.push(`/user/track-order/${order._id?.toString()}`)}><Truck/>Track Your Order</button>
                </>
                }

                {/* ADDRESS */}
                <div className="flex items-start gap-3 text-gray-700 text-sm">
                    <MapPin className="text-green-500 mt-1" size={18} />
                    <span className="font-medium text-sm sm:text-base break-words">
                        {order.address.fulladdress}
                    </span>
                </div>

                {/* ITEMS */}
                <div className="border-t border-gray-200 pt-4">

                    <button
                        className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 hover:text-green-600 transition"
                        onClick={() => setExpanded(prev => !prev)}
                    >
                        <span className="flex items-center gap-2">
                            <Package className="text-green-600" size={18} />
                            {expanded ? "Hide items" : `View ${order.items.length} items`}
                        </span>

                        {expanded
                            ? <ChevronUp size={18} className="text-green-600" />
                            : <ChevronDown size={18} className="text-green-600" />}
                    </button>

                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 space-y-3">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-xl"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        className="w-14 h-14 object-cover rounded-lg border self-start"
                                    />

                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                                            {item.name}
                                        </h4>

                                        <p className="text-gray-500 text-xs sm:text-sm">
                                            {item.quantity} × ৳{item.price}
                                        </p>
                                    </div>

                                    <span className="text-gray-800 font-semibold text-sm sm:text-base self-end sm:self-auto">
                                        ৳{Number(item.price) * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* TOTAL */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            {order.paymentMethod == "cod"
                                ? <Truck className="text-green-500" size={18} />
                                : <CreditCard className="text-green-500" size={18} />}
                            <span className="font-semibold">
                                {order.paymentMethod == "cod" ? "Cash on Delivery" : "Online Payment"}
                            </span>
                        </div>

                        <div className="text-left sm:text-right">
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">
                                ৳{order.totalAmount}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}

export default UserOderCard