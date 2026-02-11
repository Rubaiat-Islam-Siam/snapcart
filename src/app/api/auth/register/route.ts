import connectDb from "@/src/lib/db";
import User from "@/src/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();

    const name = body.name;
    const email = body.email;
    const password = String(body.password);

    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        { message: "Email already exist" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPass,
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: `Register Error: ${String(error)}` },
      { status: 500 }
    );
  }
}
