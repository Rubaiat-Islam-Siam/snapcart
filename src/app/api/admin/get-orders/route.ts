import connectDb from "@/src/lib/db";
import Order from "@/src/models/order.model";
import User from "@/src/models/user.model";
import DeliveryAssignment from "@/src/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

// Ensure models are registered with Mongoose
const _models = { User, DeliveryAssignment };

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const orders = await Order.find({}).populate("user assignedDeliveryBoy").sort({ updatedAt: -1 })
        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error: any) {
        const errMsg = error?.message || String(error);
        console.log("get-orders error:", errMsg);
        return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
    }
}