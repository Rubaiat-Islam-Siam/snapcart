"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { getSocket } from "../lib/socket"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

const DeliveryDashboad = () => {
  const { userData } = useSelector((state: RootState) => state.user)

  const [assignments, setAssignments] = useState<any[]>([])
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  /* ================= FETCH ASSIGNMENTS ================= */
  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/delivery/get-assignments")
      setAssignments(res.data.assignments || [])
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= FETCH CURRENT ACTIVE ORDER ================= */
  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order")

      if (result.data.active) {
        const order = result.data.assignment
        setActiveOrder(order)

        setUserLocation({
          latitude: order.order.address.latitude,
          longitude: order.order.address.longitude,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= ACCEPT ORDER ================= */
  const handleAccept = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)

      // refresh UI
      await fetchCurrentOrder()
      await fetchAssignments()
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= REJECT ORDER ================= */
  const handleReject = async (id: string) => {
    try {
      await axios.get(`/api/delivery/assignment/${id}/reject`)
      fetchAssignments()
    } catch (error) {
      console.log(error)
    }
  }

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    const socket = getSocket()

    const handler = (data: any) => {
      setAssignments(prev => [data, ...prev])
    }

    socket.on("new-assignment", handler)

    return () => {
      socket.off("new-assignment", handler)
    }
  }, [])

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const init = async () => {
      await fetchCurrentOrder()
      await fetchAssignments()
      setLoading(false)
    }

    init()
  }, [])

  /* ================= LOADING SCREEN ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Delivery Dashboard...
      </div>
    )
  }

  /* ================= ACTIVE DELIVERY SCREEN ================= */
  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-[120px] min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-2xl font-bold text-green-700">
            🚚 Active Delivery
          </h1>

          <p className="text-gray-700 mb-6">
            Order #{activeOrder.order._id.slice(-6)}
          </p>

          <div className="bg-white p-6 rounded-xl shadow-lg border">

            <p className="text-gray-600 mb-2 font-semibold">
              Delivery Address:
            </p>

            <p className="text-gray-800 mb-4">
              📍 {activeOrder.order.address.fulladdress}
            </p>

            <div className="text-sm text-gray-500">
              Latitude: {userLocation.latitude}
              <br />
              Longitude: {userLocation.longitude}
            </div>

          </div>
        </div>
      </div>
    )
  }

  /* ================= ASSIGNMENT LIST ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold mt-24 mb-10 text-center text-gray-800">
          🚚 Delivery Assignments
        </h2>

        {assignments.length === 0 && (
          <div className="text-center text-gray-500">
            No new assignments available
          </div>
        )}

        <div className="space-y-6">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
            >
              {/* Order Info */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-lg text-gray-800">
                    #{a?.order?._id.slice(-6)}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                  New Assignment
                </span>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm mb-5">
                📍 {a.order?.address?.fulladdress}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">

                <button
                  onClick={() => handleAccept(a._id)}
                  className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(a._id)}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                >
                  Reject
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default DeliveryDashboad