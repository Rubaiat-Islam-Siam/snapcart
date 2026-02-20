import connectDb from "@/src/lib/db";
import Order from "@/src/models/order.model";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { userId, items, paymentMethod, totalAmount, address } = await req.json()
        if (!items || !paymentMethod || !totalAmount || !address) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: "SnapCart Order Payment",
                    },
                    unit_amount: Math.round(totalAmount * 100),
                },
                quantity: 1,
            }],
            metadata: {
                orderId: newOrder._id.toString()
            },
            mode: "payment",
            success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
            cancel_url: `${process.env.NEXT_BASE_URL}/user/cart`,
        })
        return NextResponse.json({ url: session.url }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}