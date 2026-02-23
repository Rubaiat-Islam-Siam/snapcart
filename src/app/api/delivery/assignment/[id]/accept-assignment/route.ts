import { auth } from "@/src/auth"
import connectDb from "@/src/lib/db"
import DeliveryAssignment from "@/src/models/deliveryAssignment.model"
import Order from "@/src/models/order.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDb()
        const { id } = await params
        const session = await auth()
        const deliveryBoyId = session?.user?.id
        if (!deliveryBoyId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        const assignment = await DeliveryAssignment.findById(id)
        if (!assignment)
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
        if (assignment.status !== "broadcasted")
            return NextResponse.json({ error: "Assignment is not broadcasted" }, { status: 400 })
        if (!assignment.broadcastedTo.includes(deliveryBoyId))
            return NextResponse.json({ error: "Assignment was not broadcasted to you" }, { status: 400 })
        assignment.broadcastedTo.push(deliveryBoyId)

        assignment.assignedTo = deliveryBoyId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        const order = await Order.findById(assignment.order)
        if (!order)
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        order.assignedDeliveryBoy = deliveryBoyId
        order.status = "out of delivery"
        await order.save()

        await DeliveryAssignment.updateMany({
            _id: { $ne: id },
            broadcastedTo: deliveryBoyId,
            status: "broadcasted"
        }, { $pull: { broadcastedTo: deliveryBoyId } })
        return NextResponse.json({ success: true, message: "Assignment accepted successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}