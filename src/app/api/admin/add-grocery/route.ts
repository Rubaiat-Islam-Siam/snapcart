import { auth } from "@/src/auth";
import uploadOnCloudinary from "@/src/lib/cloudinary";
import connectDb from "@/src/lib/db";
import Grocery from "@/src/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if(session?.user?.role !== "admin"){
            return NextResponse.json(
                {message: "Admin require this field"},
                {status:400}
            )
        }
        const formdata = await req.formData() 
        const name = formdata.get("name") as string
        const category = formdata.get("category") as string
        const unit = formdata.get("unit") as string
        const price = formdata.get("price") as string
        const file = formdata.get("image") as Blob | null

        let imageUrl
        if(file)
            imageUrl = await uploadOnCloudinary(file)

        const grocery = await Grocery.create({
            name,category,price,unit,image:imageUrl
        })
        return NextResponse.json(
            {grocery},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message: `Add grocery error ${error}`},
            {status:500}
        )
    }
    
}