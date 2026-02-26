import { NextRequest, NextResponse } from "next/server"
import connectDb from "@/src/lib/db"
import { auth } from "@/src/auth"
import Grocery from "@/src/models/grocery.model"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session= await auth()

        if (session?.user?.role !== "admin") {
            return new Response("You are not Admin", { status: 401 })
        }
        
        const {groceryId} = await req.json()
        const grocery = await Grocery.findByIdAndDelete(groceryId)
        return NextResponse.json(grocery, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}