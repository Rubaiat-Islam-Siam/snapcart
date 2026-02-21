import connectDb from "@/src/lib/db";
import User from "@/src/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {userId,socketId} = await req.json()
        const user = await User.findByIdAndUpdate(userId,{
            socketId,
            isOnline:true
        },{new:true})
        if(!user){
            return Response.json({message:"User not found"},{status:404})
        }
        return Response.json({message:"User connected",user},{status:200})
    } catch (error) {
        return Response.json({message:"Failed to connect"},{status:500})
    }
}