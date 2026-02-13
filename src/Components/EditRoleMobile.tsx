"use client"
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Bike, User, UserCog, ArrowRight } from 'lucide-react'
import axios from 'axios'

const EditRoleMobile = () => {
  const [selectedRole, setSelectedRole] = useState("")
  const [mobile, setMobile] = useState("")

  const roles = [
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]

  // ✅ validation
  const isValid = selectedRole !== "" && mobile.length === 11

  const handleEdit = async () => {
    try {
        const result = await axios.post("/api/user/edit-role-mobile",{
            role:selectedRole,
            mobile
        })
    } catch (error) {
        
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 w-full">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>

      {/* Roles */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.id

          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-green-600 bg-green-100 shadow-lg"
                  : "border-gray-300 bg-white hover:border-green-400"
              }`}
            >
              <motion.div
                animate={{ scale: isSelected ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon size={40} className="text-green-700" />
              </motion.div>

              <span className="mt-3 text-lg font-semibold">
                {role.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center mt-12"
      >
        <label className="text-gray-700 font-medium mb-3">
          Enter Mobile Number
        </label>

        <input
          type="tel"
          maxLength={11}
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, ""))
          }
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="eg. 01*********"
          
        />
      </motion.div>

      {/* ✅ Button */}
      <motion.button
        whileTap={isValid ? { scale: 0.95 } : {}}
        whileHover={isValid ? { scale: 1.05 } : {}}
        disabled={!isValid}
        onClick={handleEdit}
        className={`mt-10 mx-auto flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
          isValid
            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Go to Home
        <ArrowRight size={20} />
      </motion.button>

    </div>
  )
}

export default EditRoleMobile
