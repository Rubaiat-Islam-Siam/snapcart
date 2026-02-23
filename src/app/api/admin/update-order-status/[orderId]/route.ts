import connectDb from "@/src/lib/db";
import DeliveryAssignment from "@/src/models/deliveryAssignment.model";
import Order from "@/src/models/order.model";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: {
    params: { orderId: string }
}) {
    try {
        await connectDb()
        const { orderId } = await params
        const { status, isPaid } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
        }
        if (status) order.status = status
        if (isPaid !== undefined) order.isPaid = isPaid
        let deliveryBoyPayload: any = []
        if (status == "out of delivery" && !order.assignment) {
            const { latitude, longitude } = order.address
            const nearByDeliveryBoy = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 10000
                    }
                }
            })
            const nearByIds = nearByDeliveryBoy.map((boy) => boy._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["assigned", "broadcasted"] }
            }).distinct("assignedTo")
            const busyIdsSet = new Set(busyIds.map(b => String(b)))
            const availableDeliveryBoy = nearByDeliveryBoy.filter((b) => !busyIdsSet.has(String(b._id)))
            const candidates = availableDeliveryBoy.map((b) => b._id)

            if (candidates.length == 0) {
                await order.save()
                return NextResponse.json({ message: "No avaliable delivery boy" }, { status: 200 })
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            })

            order.assignment = deliveryAssignment._id
            deliveryBoyPayload = availableDeliveryBoy.map((b) => ({
                id: b._id,
                name: b.name,
                mobile: b.mobile,
                latitude: b.location?.coordinates[1],
                longitude: b.location?.coordinates[0]
            }))
            await deliveryAssignment.populate("order")

        }
        order.status = status
        await order.save()
        return NextResponse.json({
            success: true,
            message: "Order updated successfully",
            assignment: order.assignment,
            availableDeliveryBoy: deliveryBoyPayload
        }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to update order status"
        }, { status: 500 })
    }
}