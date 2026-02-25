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

const DeliveryDashboad = () => {
  const { userData } = useSelector((state: RootState) => state.user)

  const [assignments, setAssignments] = useState<IPopulatedAssignment[]>([])
  const [activeOrder, setActiveOrder] = useState<IPopulatedAssignment | null>(null)
  const [userLocation, setUserLocation] = useState<ILocation | null>({ latitude: 0, longitude: 0 })
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation | null>({ latitude: 0, longitude: 0 })
  const [loading, setLoading] = useState(true)

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

        if (order?.order?.address?.latitude && order?.order?.address?.longitude) {
          setUserLocation({
            latitude: order.order.address.latitude,
            longitude: order.order.address.longitude,
          })
        }
      }
    } catch (error) {
      console.log(error)
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
        socket.emit("delivery-location", {
          userId: userData._id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (err) => {
        console.log(err)
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
  })

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

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-100">
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
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 pt-[120px] px-6 pb-10">
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

      <DeliveryChat
        orderId={activeOrder.order._id}
        deliveryBoyId={userData?._id!}
      />
    </motion.div>
  </div>
)
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-6 pb-16">
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

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 text-gray-700 text-sm mb-8">
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