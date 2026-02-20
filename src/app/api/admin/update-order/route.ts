import connectDb from "@/src/lib/db";
import Order from "@/src/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        await connectDb();
        const { orderId, status, isPaid } = await req.json();

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
        }

        const updateData: Record<string, any> = {};
        if (status !== undefined) updateData.status = status;
        if (isPaid !== undefined) updateData.isPaid = isPaid;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
    }
}
