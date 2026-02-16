import { auth } from "@/src/auth";
import User from "@/src/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const session = await auth()
        if(!session || !session.user) {
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }
        const user = await User.findOne({email: session.user.email}).select("-password")
        if(!user) {
            return NextResponse.json({error:"User not found"}, {status:404})
        }
        return NextResponse.json({user:user}, {status:200})
    } catch (error) {
        return NextResponse.json({error:"Internal server error"}, {status:500})
    }
    
}