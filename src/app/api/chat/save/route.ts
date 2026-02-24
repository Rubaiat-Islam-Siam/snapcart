import connectDb from "@/src/lib/db"
import Message from "@/src/models/message.model"
import Order from "@/src/models/order.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { roomId, senderId, text, time} = await req.json()
        const room = await Order.findById(roomId)
        if(!room){
            return NextResponse.json({ error: "Room not found" }, { status: 404 })
        }
        const message = await Message.create({
            roomId,
            senderId,
            text,
            time
        })
        
        // Populate the sender info before returning
        await message.populate('senderId')
        return NextResponse.json(message, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "save message error" }, { status: 500 })
    }
}