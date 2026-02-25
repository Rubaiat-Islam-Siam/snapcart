import connectDb from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import DeliveryAssignment from "@/src/models/deliveryAssignment.model";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { orderId, otp } = await req.json()
        const order = await Order.findById(orderId)
        if (!orderId || !otp) {
            return NextResponse.json({ error: "OrderId and OTP are required" }, { status: 404 })
        }

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        if (order.deliveryOtp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
        }

        order.status = "delivered"
        order.deliveryAt = new Date()
        order.deliveryOtpVerification = true
        await order.save()

        await DeliveryAssignment.updateOne({order: orderId}, { $set: {assignedTo: null, status: "completed" } })
        return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
    }
}