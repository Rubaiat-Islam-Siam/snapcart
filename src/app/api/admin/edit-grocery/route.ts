import { NextRequest, NextResponse } from "next/server"
import Grocery from "@/src/models/grocery.model"
import connectDb from "@/src/lib/db"
import { auth } from "@/src/auth"
import uploadOnCloudinary from "@/src/lib/cloudinary"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session= await auth()

        if (session?.user?.role !== "admin") {
            return new Response("You are not Admin", { status: 401 })
        }
        const formData = await req.formData()
        const name = formData.get("name") as string
        const groceryId = formData.get("groceryId") as string
        const category = formData.get("category") as string
        const price = formData.get("price") as string
        const unit = formData.get("unit") as string
        const file = formData.get("image") as Blob | null
        let imageUrl
        if(file){
            imageUrl = await uploadOnCloudinary(file)
        }
        const grocery = await Grocery.findByIdAndUpdate(groceryId,{ name, category, price, unit, image: imageUrl })
        return NextResponse.json(grocery, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}