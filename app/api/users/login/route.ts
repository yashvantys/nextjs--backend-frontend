import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log(requestBody);
    const { email, password } = requestBody;
    console.log("Email & password", email, password);
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User does not exits", status: 400 });
    }
    // check if password is correct
    const validatePassword = await bcryptjs.compare(password, user.password);
    if (!validatePassword) {
      return NextResponse.json({ error: "Invalid password", status: 400 });
    }
    // create token data
    const tokenData = {
      id: user._id,
      userName: user.userName,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    const response = NextResponse.json({
      message: "Login Successfully",
      success: true,
    });
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    console.log("Login error", error.message);
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}
