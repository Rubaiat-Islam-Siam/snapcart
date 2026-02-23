import connectDb from "@/src/lib/db"
import emitEventHandler from "@/src/lib/emitEventHandler"
import Order from "@/src/models/order.model"
import User from "@/src/models/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const {userId,items,paymentMethod,totalAmount,address} =await req.json()
        if(!items || !paymentMethod || !totalAmount || !address){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }
        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const newOrder = await Order.create({
            user: userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        await emitEventHandler("new-order",newOrder)
        
        return NextResponse.json({ newOrder }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}