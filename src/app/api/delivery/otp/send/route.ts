import connectDb from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/src/models/order.model";
import { sendMail } from "@/src/lib/mailer";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { orderId } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }
        const otp = Math.floor(1000 + Math.random() * 9000)
        order.deliveryOtp = otp
        await order.save()
        
        await sendMail(order.user.email, "OTP Verification", `<p>Your OTP is <strong>${otp}</strong></p>`)
        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
    }
}