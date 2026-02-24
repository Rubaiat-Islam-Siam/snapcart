import connectDb from "@/src/lib/db"
import Message from "@/src/models/message.model"
import Order from "@/src/models/order.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { roomId } = await req.json()
        
        // roomId is the orderId - query messages directly
        const messages = await Message.find({ roomId }).populate("senderId").sort({ createdAt: 1 })
        return NextResponse.json(messages, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
    }
}