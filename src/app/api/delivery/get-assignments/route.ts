import { auth } from "@/src/auth";
import connectDb from "@/src/lib/db";
import DeliveryAssignment from "@/src/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()
        const session = await auth()
        const assignments = await DeliveryAssignment.find({
            broadcastedTo: session?.user?.id,
            status: "broadcasted"
        }).populate("order")
        return NextResponse.json({ success: true, assignments }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch assignments" }, { status: 500 })
    }
}