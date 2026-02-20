
import connectDb from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDb();
        const orders = await Order.find({}).populate("user")
        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
    }
}