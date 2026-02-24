import connectDb from "@/src/lib/db"
import Order from "@/src/models/order.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDb()
        const { orderId } = await params
        const order = await Order.findById(orderId).populate("assignedDeliveryBoy")
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }
        return NextResponse.json({ success: 200, order })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to get order" }, { status: 500 })
    }
}