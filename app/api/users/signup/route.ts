import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userName, email, password } = reqBody;
    console.log("Request Body", reqBody);
    // check if user is already exits
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "User already exits", status: 400 });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const userObject = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const response = await userObject.save();
    console.log("User Creation Response", response);
    // send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: response._id });

    return NextResponse.json({
      message: "User created successfully",
      status: 201,
      success: true,
      response,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
