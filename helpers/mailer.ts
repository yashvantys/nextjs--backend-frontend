import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log("emailType", emailType);
    console.log("hashedToken", hashedToken);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifiedToken: hashedToken,
          verifiedTokenExpiry: Date.now() + 1,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 1,
        },
      });
    }
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "53a16f9116ac2f",
        pass: "5b6c3611ebfded",
      },
    });
    const verifyEmailLink = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;
    const resetEmailLink = `${process.env.DOMAIN}/email?token=${hashedToken}`;
    const mailOptions = {
      from: "yashvanty@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        emailType === "VERIFY" ? verifyEmailLink : resetEmailLink
      }">here</a> to ${
        emailType === "VERIFY" ? "Verify your email" : "Reset your password"
      } or copy and paste the link below in your browser<br> ${
        emailType === "VERIFY" ? verifyEmailLink : resetEmailLink
      }</p>`,
    };

    const emailResponse = await transport.sendMail(mailOptions);
    return emailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
