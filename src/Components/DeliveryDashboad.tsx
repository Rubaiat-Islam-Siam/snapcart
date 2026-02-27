"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { getSocket } from "../lib/socket"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { IOder } from "../models/order.model"
import DeliveryChat from "./DeliveryChat"
import { Loader2 } from "lucide-react"
import { Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis,BarChart } from "recharts"

const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false })

interface ILocation {
  latitude: number
  longitude: number
}

// Type for populated assignment from API
interface IPopulatedAssignment {
  _id: string
  order: IOder
  broadcastedTo: string[]
  assignedTo: string | null
  status: "broadcasted" | "assigned" | "completed"
  acceptedAt: Date
  createdAt?: Date
  updatedAt?: Date
}

const DeliveryDashboad = ({earning}: {earning: number}) => {
  const { userData } = useSelector((state: RootState) => state.user)

  const [assignments, setAssignments] = useState<IPopulatedAssignment[]>([])
  const [activeOrder, setActiveOrder] = useState<IPopulatedAssignment | null>(null)
  const [userLocation, setUserLocation] = useState<ILocation | null>({ latitude: 0, longitude: 0 })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation | null>({ latitude: 0, longitude: 0 })
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  const todaysEarnings = [
    {
      name: "Today",
      earning,
      deliveries: earning / 60
    }
  ]

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/delivery/get-assignments")
      setAssignments(res.data.assignments || [])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order")

      if (result.data.active) {
        const order = result.data.assignment
        setActiveOrder(order)

        console.log("Active Order:", order)
        console.log("Order Address:", order?.order?.address)

        if (order?.order?.address?.latitude && order?.order?.address?.longitude) {
          const location = {
            latitude: order.order.address.latitude,
            longitude: order.order.address.longitude,
          }
          console.log("Setting user location:", location)
          setUserLocation(location)
        } else {
          console.error("No valid address coordinates found in order")
        }
      }
    } catch (error) {
      console.log("Error fetching current order:", error)
    }
  }

  useEffect(() => {
    const socket = getSocket()
    if (!userData?._id) return
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setDeliveryBoyLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        socket.emit("update-location", {
          userId: userData._id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (err) => {
        console.log("Geolocation error:", err)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [userData?._id])

  const handleAccept = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
      await fetchCurrentOrder()
      await fetchAssignments()
    } catch (error) {
      console.log(error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/reject`)
      fetchAssignments()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const socket = getSocket()

    const handler = (data: IPopulatedAssignment) => {
      setAssignments(prev => [data, ...prev])
    }

    socket.on("new-assignment", handler)

    return () => {
      socket.off("new-assignment", handler)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await fetchCurrentOrder()
      await fetchAssignments()
      setLoading(false)
    }
    init()
  }, [])

  const sentOpt = async () => {
    try {
      setSendOtpLoading(true)
      const result = await axios.post('/api/delivery/otp/send', { orderId: activeOrder?.order._id })
      console.log(result)
      setShowOtpBox(true)
    } catch (error) {
      setOtpError("Failed to send OTP")
      console.log(error)
    } finally {
      setSendOtpLoading(false)
    }
  }

  const verifyOtp = async () => {
    try {
      setVerifyOtpLoading(true)
      const result = await axios.post('/api/delivery/otp/verify', { orderId: activeOrder?.order._id, otp })
      console.log(result)
      setActiveOrder(null)
      setShowOtpBox(false)
      window.location.reload()
    } catch (error) {
      setOtpError("Invalid OTP")
      console.log(error)
    } finally {
      setVerifyOtpLoading(false)
    }
  }

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-green-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold text-emerald-600"
        >
          Loading Delivery Dashboard...
        </motion.div>
      </div>
    </div>
  )
}

  if (activeOrder && userLocation && userLocation.latitude !== 0 && userLocation.longitude !== 0) {
    return (
  <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-green-100 pt-20 px-6 pb-10">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-600">
            🚚 Active Delivery
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Order #{activeOrder.order._id.toString().slice(-6)}
          </p>
        </div>

        <span className="px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
          In Progress
        </span>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
          Delivery Address
        </p>
        <p className="text-lg text-gray-800 font-medium">
          📍 {activeOrder.order.address.fulladdress}
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-2xl mb-10">
        <LiveMap
          userLocation={userLocation}
          deliveryBoyLocation={deliveryBoyLocation}
        />
      </div>

      {userData?._id && (
        <DeliveryChat
          orderId={activeOrder.order._id}
          deliveryBoyId={userData._id}
        />
      )}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
          <button className="bg-green-600 w-full text-white px-6 py-4 rounded-lg cursor-pointer hover:bg-green-700" onClick={sentOpt} >
            {sendOtpLoading ? <Loader2 className="animate-spin text-center" /> : "Mark as Delivered"}
          </button>
        )}

        {showOtpBox && (
          <div className="mt-4">
            <input type="number" placeholder="Enter OTP" className="w-full py-3 rounded-lg text-center shadow-xl" value={otp} onChange={(e) => setOtp(e.target.value)} />
            {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
            <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg" onClick={verifyOtp}>{verifyOtpLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}</button>
          </div>
        )}
        {activeOrder.order.deliveryOtpVerification && (
          <p className="text-green-500 text-sm mt-2">Delivery Completed!</p>
        )}
        
      </div>
    </motion.div>
  </div>
)
  }

  return (
  <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 px-6 pb-16">
    <div className="max-w-6xl mx-auto">
      
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mt-28 mb-14 text-center text-gray-800"
      >
        🚚 Delivery Assignments
      </motion.h2>

      {assignments.length === 0 && (
        <div className="text-center text-gray-400 text-lg">
          No new assignments available
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-xl p-6">
        <h3 className="text-sm text-gray-500 uppercase tracking-wide">
          Today&apos;s Earnings
        </h3>
        <p className="text-3xl font-bold text-emerald-600 mt-2">
          ${earning.toFixed(2)}
        </p>
        <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={todaysEarnings}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="date" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="orders"
                      fill="#16a34a"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-4 text-lg font-bold text-green-600 ">${earning || 0} Earned Today</p>
                <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg" onClick={()=>window.location.reload()}>Refresh Earning</button>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {assignments.map((a, index) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Order ID
                </p>
                <p className="font-bold text-2xl text-gray-800">
                  #{a?.order?._id.toString().slice(-6)}
                </p>
              </div>

              <span className="px-4 py-2 text-xs bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                New
              </span>
            </div>

            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-5 text-gray-700 text-sm mb-8">
              📍 {a.order?.address?.fulladdress}
            </div>

            <div className="flex gap-5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleAccept(a._id)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg border-none outline-none transition-all duration-200"
              >
                Accept
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleReject(a._id)}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold shadow-lg border-none outline-none transition-all duration-200"
              >
                Reject
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
)
}

export default DeliveryDashboad