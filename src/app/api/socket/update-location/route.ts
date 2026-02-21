import { NextRequest, NextResponse } from "next/server"
import User from "@/src/models/user.model"
import connectDb from "@/src/lib/db"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { userId, location } = await req.json()
        if (!userId || !location) {
            return NextResponse.json({ message: "Missing UserId and Location" }, { status: 400 })
        }
        const user = await User.findByIdAndUpdate(userId, { location }, { new: true })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Location updated", user }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Failed to update location" }, { status: 500 })
    }
}