"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { getSocket } from "../lib/socket"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { IOder } from "../models/order.model"

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-indigo-600"
        >
          🚚 Loading Delivery Dashboard...
        </motion.div>
      </div>
    )
  }

  if (activeOrder && userLocation && userLocation.latitude !== 0 && userLocation.longitude !== 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-[120px] p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-green-100"
        >
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">
            🚚 Active Delivery
          </h1>

          <p className="text-gray-600 mb-6">
            Order #{activeOrder.order._id.toString().slice(-6)}
          </p>

          <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border border-emerald-100">
            <p className="text-sm text-gray-500 font-semibold mb-2">
              Delivery Address
            </p>
            <p className="text-lg text-gray-800">
              📍 {activeOrder.order.address.fulladdress}
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mt-24 mb-12 text-center text-gray-800"
        >
          🚚 Delivery Assignments
        </motion.h2>

        {assignments.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No new assignments available
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {assignments.map((a, index) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="font-bold text-xl text-gray-800">
                    #{a?.order?._id.toString().slice(-6)}
                  </p>
                </div>

                <span className="px-4 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                  New Assignment
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm mb-6 border">
                📍 {a.order?.address?.fulladdress}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleAccept(a._id)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg"
                >
                  Accept
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleReject(a._id)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg"
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