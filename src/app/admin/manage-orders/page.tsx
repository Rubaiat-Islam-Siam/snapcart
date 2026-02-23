"use client"
import AdminOrdersCard from "@/src/Components/AdminOrdersCard";
import { getSocket } from "@/src/lib/socket";
import { IOder } from "@/src/models/order.model";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ManageOrders() {
    const router = useRouter()
    const [orders,setOders] = useState<IOder[]>()
    useEffect(()=>{
        const getOrders= async()=> {
            try {
                const result = await axios.get("/api/admin/get-orders") 
                setOders(result.data.orders);
            } catch (error) {
                console.log(error);
            }
        }
        getOrders();
    },[])

    useEffect(()=>{
        const socket = getSocket()
        socket.on("new-order",(newOrder:IOder)=>{
            setOders((prev)=>[newOrder,...prev!])
        })
        return ()=>{
            socket.disconnect()
        }
    },[])
    return (
        <div>
            <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative ">
                <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
                    <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-4">
                        <button className="hover:bg-gray-200 active:scale-90 transition-colors rounded-full" onClick={()=>router.push("/")} ><ArrowLeft className="w-6 h-6 text-green-600"/></button>
                        <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
                    </div>
                </div>
                {orders?.map((order,index)=>(
                    <AdminOrdersCard key={index} order={order}/>
                ))}
            </div>
        </div>
    );
}

export default ManageOrders;