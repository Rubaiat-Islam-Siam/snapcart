import { auth } from "@/src/auth";
import connectDb from "@/src/lib/db";
import DeliveryAssignment from "@/src/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    const activeAssignment = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({ 
        path: "order", 
        populate: [
          { path: "address" },
          { path: "user", select: "name email mobile" }
        ]
      })
      .lean();
    if (!activeAssignment)
      return NextResponse.json({ active: false }, { status: 200 });
    return NextResponse.json(
      { active: true, assignment: activeAssignment },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `current oder error ${error}` },
      { status: 200 },
    );
  }
}
