"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSocket } from '../lib/socket'

const DeliveryDashboad = () => {
  const [assignments, setAssignments] = useState<any[]>([])
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/api/delivery/get-assignments");
        setAssignments(res.data.assignments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(()=>{
    const socket = getSocket()
    socket.on("new-assignment",(data)=>{
      setAssignments((prev:any)=>[...prev,data])
    })
    return ()=>{
      socket.off("new-assignment")
    }
  },[])
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mt-[100px] mb-[30px]'>Delivery Assignments</h2>
        {assignments.map(a => (
          <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
            <p><b>Order ID</b> #{a?.order?._id.slice(-6)}</p>
            <p className='text-gray-600'>{a.order?.address?.fulladdress}</p>

            <div className='flex gap-3 mt-4'>
              <button className='bg-green-600 text-white py-2 rounded-lg flex-1'>Accept</button>
              <button className='bg-red-600 text-white py-2 rounded-lg flex-1'>Reject</button>
            </div>
          </div>

        ))}
      </div>
    </div>
  )
}

export default DeliveryDashboad
