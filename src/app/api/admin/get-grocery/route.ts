import connectDb from "@/src/lib/db";
import Grocery from "@/src/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const groceries = await Grocery.find({})
        return NextResponse.json({groceries},{status:200}) 
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Internal server error"},{status:500}) 
    }
}