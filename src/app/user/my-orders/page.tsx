"use client"
import UserOderCard from "@/src/Components/UserOderCard"
import { IOder } from "@/src/models/order.model"
import axios from "axios"
import { ArrowLeft, PackageSearch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function MyOrders() {
    const router = useRouter()
    const [orders,setOrders] = useState<IOder[]>()
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        const getMyOrders = async()=>{
            try {
                setLoading(true)
                const result = await axios.get("/api/user/my-orders")
                setOrders(result.data.orders)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        getMyOrders()
    },[])

    if(loading){
        return <div className="flex items-center justify-center min-h-[50vh] text-green-600 ">Loading Your Order...</div>
    }
    return (
        <div className="min-h-screen bg-liner-to-b from-white to-gray-100 w-full">
            <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative ">
                <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
                    <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-4">
                        <button className="hover:bg-gray-200 active:scale-90 transition-colors rounded-full" onClick={()=>router.push("/")} ><ArrowLeft className="w-6 h-6 text-green-600"/></button>
                        <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
                    </div>
                </div>
                {orders && orders.length == 0 ? (
                    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] ">
                        <PackageSearch size={70} className="text-green-600 mb-2"/>
                        <h2 className="text-gray-700 font-semibold text-xl">No Orders Found</h2>
                        <p className="text-gray-600 text-sm mt-1">Start Shopping to view your orders.</p>
                    </div>
                ):(
                    <div className="mt-4 space-y-6">
                        {orders?.map((order,index)=>(
                            <motion.div
                            key={index}
                            initial={{opacity:0,y:20}}
                            animate={{opacity:1,y:0}}
                            transition={{duration:0.3,delay:index*0.1}}
                            >
                                <UserOderCard order={order}/>
                            </motion.div>
                            
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders