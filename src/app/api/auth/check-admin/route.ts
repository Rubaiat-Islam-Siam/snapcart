import User from "@/src/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await User.find({ role: "admin"})
        if(user.length > 0)
            return NextResponse.json({ success: true, message: "Admin already exists", adminExist: true }, { status: 200 })
        else
            return NextResponse.json({ success: false, message: "Admin not found", adminExist: false }, { status: 404 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Admin check failed", adminExist: false }, { status: 500 })
    }
}