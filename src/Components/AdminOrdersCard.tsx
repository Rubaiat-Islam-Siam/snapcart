"use client"
import { CheckCircle, ChevronDown, ChevronUp, CreditCard, Loader2, MapPin, Package, Phone, Truck, User, UserCheck, XCircle } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import axios from "axios"
import { IOder } from "../models/order.model"
import Image from "next/image"

const statuses = ["pending", "out of delivery", "delivered", "cancelled"] as const

function AdminOrdersCard({ order }: { order: IOder }) {
    const [expanded, setExpanded] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(order.status)
    const [isPaid, setIsPaid] = useState(order.isPaid)
    const [updating, setUpdating] = useState(false)
    const [updatingPaid, setUpdatingPaid] = useState(false)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-300 ring-yellow-100"
            case "out of delivery":
                return "bg-blue-50 text-blue-700 border-blue-300 ring-blue-100"
            case "delivered":
                return "bg-green-50 text-green-700 border-green-300 ring-green-100"
            case "cancelled":
                return "bg-red-50 text-red-700 border-red-300 ring-red-100"
            default:
                return "bg-gray-50 text-gray-700 border-gray-300 ring-gray-100"
        }
    }

    const getStatusDot = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500"
            case "out of delivery": return "bg-blue-500"
            case "delivered": return "bg-green-500"
            case "cancelled": return "bg-red-500"
            default: return "bg-gray-500"
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        setUpdating(true)
        try {
            await axios.post(`/api/admin/update-order-status/${order._id}`, {
                status: newStatus
            })
            setCurrentStatus(newStatus as typeof currentStatus)
        } catch (error) {
            console.log(error)
        }
        setUpdating(false)
    }

    const handlePaidChange = async (paid: boolean) => {
        setUpdatingPaid(true)
        try {
            await axios.post(`/api/admin/update-order-status/${order._id}`, {
                isPaid: paid
            })
            setIsPaid(paid)
        } catch (error) {
            console.log(error)
        }
        setUpdatingPaid(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 mb-5"
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
                        {new Date(order.createdAt || new Date()).toLocaleDateString("en-US", {
                            weekday: "short", year: "numeric", month: "short", day: "numeric"
                        })}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isPaid
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {isPaid ? "✓ Paid" : "✗ Unpaid"}
                    </span>

                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize flex items-center gap-1.5 ${getStatusColor(currentStatus)}`}>
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(currentStatus)} animate-pulse`}></span>
                        {currentStatus}
                    </span>
                </div>
            </div>

            {/* BODY */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

                {/* CUSTOMER INFO */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Details</h4>

                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                        <User className="text-green-500 shrink-0" size={16} />
                        <span className="font-medium">{typeof order.user === "object" && order.user !== null && "name" in order.user ? order.user.name : "Unknown"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700 text-sm">
                        <Phone className="text-green-500 shrink-0" size={16} />
                        <span className="font-medium">{order.address?.mobile}</span>
                    </div>

                    <div className="flex items-start gap-3 text-gray-700 text-sm">
                        <MapPin className="text-green-500 mt-0.5 shrink-0" size={16} />
                        <span className="font-medium break-words">
                            {order.address?.fulladdress || "No address provided"}
                        </span>
                    </div>
                </div>

                {/* PAYMENT */}
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                    {order.paymentMethod == "cod"
                        ? <Truck className="text-green-500" size={18} />
                        : <CreditCard className="text-green-500" size={18} />}
                    <span className="font-semibold text-sm sm:text-base">
                        {order.paymentMethod == "cod" ? "Cash on Delivery" : "Online Payment"}
                    </span>
                </div>

                {order.assignedDeliveryBoy && typeof order.assignedDeliveryBoy === 'object' && order.assignedDeliveryBoy !== null && 'name' in order.assignedDeliveryBoy && (
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
                )}

                {/* ITEMS TOGGLE */}
                <div className="border-t border-gray-200 pt-4">
                    <button
                        className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 hover:text-green-600 transition"
                        onClick={() => setExpanded(prev => !prev)}
                    >
                        <span className="flex items-center gap-2">
                            <Package className="text-green-600" size={18} />
                            {expanded ? "Hide items" : `View ${order.items.length} item${order.items.length > 1 ? "s" : ""}`}
                        </span>

                        {expanded
                            ? <ChevronUp size={18} className="text-green-600" />
                            : <ChevronDown size={18} className="text-green-600" />}
                    </button>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
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
                                                width={56}
                                                height={56}
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
                        )}
                    </AnimatePresence>
                </div>

                {/* STATUS UPDATE */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Update Status</h4>

                    <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                disabled={updating || currentStatus === status}
                                onClick={() => handleStatusChange(status)}
                                className={`px-4 py-2 text-xs font-semibold rounded-full border capitalize transition-all duration-200
                                    ${currentStatus === status
                                        ? `${getStatusColor(status)} ring-2 cursor-default`
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700 active:scale-95"
                                    }
                                    ${updating ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                            >
                                {updating && currentStatus !== status ? "" : status}
                                {updating && currentStatus !== status && <Loader2 className="w-3 h-3 animate-spin inline" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PAYMENT STATUS */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</h4>

                    <div className="flex flex-wrap gap-2">
                        <button
                            disabled={updatingPaid || isPaid}
                            onClick={() => handlePaidChange(true)}
                            className={`px-4 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all duration-200
                                ${isPaid
                                    ? "bg-green-50 text-green-700 border-green-300 ring-2 ring-green-100 cursor-default"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700 active:scale-95"
                                }
                                ${updatingPaid ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                        >
                            {updatingPaid && !isPaid ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle size={14} />}
                            Paid
                        </button>

                        <button
                            disabled={updatingPaid || !isPaid}
                            onClick={() => handlePaidChange(false)}
                            className={`px-4 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all duration-200
                                ${!isPaid
                                    ? "bg-red-50 text-red-700 border-red-300 ring-2 ring-red-100 cursor-default"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-700 active:scale-95"
                                }
                                ${updatingPaid ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                        >
                            {updatingPaid && isPaid ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle size={14} />}
                            Unpaid
                        </button>
                    </div>
                </div>

                {/* TOTAL */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 pt-4 border-t">
                    <div className="text-left sm:text-right ml-auto">
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">
                            ৳{order.totalAmount}
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}

export default AdminOrdersCard