import { auth } from "@/src/auth";
import connectDb from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        const orders = await Order.find({ user: session?.user?.id }).populate("user").sort({ updatedAt: -1 })
        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: "No orders found", orders: [] }, { status: 200 })
        }
        return NextResponse.json({ message: "Orders fetched successfully", orders }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

