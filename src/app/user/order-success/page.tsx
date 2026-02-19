"use client"
import { CheckCircle, Package } from "lucide-react"
import { easeInOut, motion } from "motion/react"
import Link from "next/link"

function orderSuccess() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[100vh] px-6 text-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100">

            {/* Floating glow background */}
            <div className="absolute w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl top-[-100px] left-[-150px]" />
            <div className="absolute w-[400px] h-[400px] bg-green-300/30 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />

            {/* Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ damping: 10, type: "spring", stiffness: 100 }}
                className="relative flex items-center justify-center"
            >
                <div className="absolute w-40 h-40 bg-green-500/20 rounded-full blur-2xl" />
                <CheckCircle className="w-24 h-24 md:w-28 md:h-28 text-green-600 drop-shadow-lg" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0.3, 0, 0.3], scale: [1, 0.6, 1] }}
                    transition={{ repeat: Infinity, ease: "easeInOut", duration: 2 }}
                    className="absolute inset-0 rounded-full border-4 border-green-300"
                />
            </motion.div>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-3xl md:text-4xl font-extrabold text-green-700 mt-8 tracking-tight"
            >
                Order Placed Successfully!
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm md:text-base max-w-md text-gray-600 mt-4 leading-relaxed"
            >
                Thank you for shopping with us! Your order have been placed and is being processed.
                You can track its progress in your{" "}
                <span className="font-semibold text-green-700">My Order</span> section.
            </motion.p>

            {/* Floating package */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="mt-10"
            >
                <Package className="w-16 h-16 md:w-20 md:h-20 text-green-500 drop-shadow-md" />
            </motion.div>

            {/* Button */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ duration: 2, delay: 1 }}
                className="mt-10"
            >
                <Link href="/user/my-orders">
                    <motion.div
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-green-600 shadow-lg shadow-green-500/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all"
                    >
                        Go to My Orders
                    </motion.div>
                </Link>
            </motion.div>

            {/* Floating particles */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-20 left-[10%] w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                <div className="absolute top-32 left-[30%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute top-24 left-[60%] w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                <div className="absolute top-16 left-[80%] w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </motion.div>
        </div>
    )
}

export default orderSuccess
