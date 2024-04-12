import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log("token", token);
    const user = await User.findOne({
      verifiedToken: token,
      //verifiedTokenExpiry: { $gt: new Date() },
    });

    console.log("user", user);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(user);
    user.isVerified = true;
    user.verifiedToken = undefined;
    user.verifiedTokenExpiry = undefined;
    await user.save();
    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
