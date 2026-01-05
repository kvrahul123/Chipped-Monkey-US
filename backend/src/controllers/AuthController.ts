import {
  Body,
  Post,
  Route,
  Controller,
  Request,
  Get,
  UploadedFile,
  FormField,
} from "tsoa";
import { AppDataSource } from "../../data-source"; // Adjust path as needed
import { User } from "../../entities/User"; // Adjust path as needed
import { LoginUserRequest } from "../../models/Login"; // Adjust path as needed
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request as ExpressRequest } from "express";
import { IsString, IsEmail, IsNotEmpty } from "class-validator"; // Import validation decorators
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getManager } from "typeorm";
import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import moment from "moment-timezone";
import crypto, { randomInt } from "crypto";
import { Uploads } from "../../entities/Uploads";
import { BreederDetail } from "../../entities/BreederDetails";
import multer from "multer";
import express from "express";
import { sendForgotPasswordEmail } from "../../utils/mail";

import path from "path";
import { Contact } from "../../entities/Contact";

require("dotenv").config();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/breeder_details");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });
interface MulterRequest extends express.Request {
  implanter_certificate?: Express.Multer.File;
}
export interface RegisterUserRequest {
  // Remove or comment out the @Required() on name
  // @Required()
  // name: string;

  first_name: string;
  surf_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  account_type: string;
  title: string;
  breeder_check?: boolean;
  implanter_radio?: string;
  implanter_pin?: string;
  implanter_certificate?: any;
  breeder_licence_no?: string;
  breeder_local_authority?: string;
  dealer_licence_no?: string;
  dealer_local_authority?: string;
  local_authority?: string;
  user_type?: string;
}

interface AuthenticatedRequest extends ExpressRequest {
  user?: { userId: number; email: string };
}



const transporter = nodemailer.createTransport({
  host: "inficodes.com", // Your custom SMTP server (e.g., smtp.gmail.com for Gmail)
  port: 587, // Common SMTP port (587 for TLS, 465 for SSL)
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL_ID,
    pass: process.env.SMTP_EMAIL_PASSWORD, // Consider using environment variables for sensitive data
  },
});

// Define the RegisterUserRequest class in the same file
export class UpdatePasswordRequest {
  token?: string;

  confirm_password?: string;
}

export class ResetPasswordRequest {
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  user_type?: string;

  url?: string;
}
@Route("auth")
export class AuthController extends Controller {
  @Post("/login")
  public async Login(
    @Body() body: LoginUserRequest
  ): Promise<{ message: string; token?: string; statusCode?: number }> {
    const userRepository = AppDataSource.getRepository(User);
    const uploadRepository = AppDataSource.getRepository(Uploads);
    const contactRepository = AppDataSource.getRepository(Contact);

    if (!body.password) {
      return { message: "Password is required", statusCode: 422 };
    }

    const existingUser = await userRepository.findOneBy({ email: body.email });

    if (!existingUser) {
      return { message: "Invalid Email", statusCode: 422 };
    }

    // CHECK USER STATUS
    if (existingUser.status?.toLowerCase() !== "active") {
      return { message: "Account is not active", statusCode: 422 };
    }

    const compatibleHash = existingUser.password.replace("$2y$", "$2a$");

    const passwordMatch = bcrypt.compareSync(body.password, compatibleHash);

    if (!passwordMatch) {
      return { message: "Invalid Password", statusCode: 422 };
    }

    let usertypeMatch;
    const dbType = existingUser.type?.toLowerCase();
    const bodyType = body.user_type?.toLowerCase();

    if (
      dbType === "chipped_monkey_admin" ||
      dbType === "supervisor" ||
      dbType === "admin"
    ) {
      usertypeMatch = true;
    } else {
      usertypeMatch = dbType ? bodyType === dbType : false;
    }

    if (!usertypeMatch) {
      return { message: "Invalid user type", statusCode: 422 };
    }

    // Get the mapped file name from the Uploads table
    // let userAvatar;
    // let avatar_original = existingUser.avatar_original?.split(',');

    // console.log("existingUser.avatar_original: ", existingUser.avatar_original); // Debug this

    // if (avatar_original && avatar_original[0]) {
    //    console.log("avatar_original split result: ", avatar_original); // Check the split result
    //    userAvatar = await uploadRepository.findOne({
    //     where: { id: Number(avatar_original[0]) },
    //   });
    // } else {
    //   userAvatar = {};
    // }

    // console.log("userAvatar retrieved: ", userAvatar); // Log userAvatar result

    // // If an avatar file exists, use its name, otherwise use a default placeholder
    // const avatarFileName = userAvatar ? userAvatar.file_name : 'no-user.png';
    // console.log("avatarFileName: ", avatarFileName); // Log final avatar file name
    if (
      body.microchipNumber != "" &&
      body.microchipNumber != null &&
      body.microchipNumber != undefined
    ) {
      let contact = await contactRepository.findOneBy({
        microchip_number: body.microchipNumber,
      });
      if (contact) {
        contact.user_id = existingUser.id;
        contact.is_claimed = "true";
        await contactRepository.save(contact);
      }
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        user_type: existingUser.type,
        user_name: existingUser.name,
        account_type: existingUser.account_type,
        // avatar_original: avatarFileName // Use the mapped file name here
      },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "5h" }
    );

    return { message: "Login successful", token, statusCode: 200 };
  }

  @Post("/verify-reset-token")
public async verifyResetToken(
  @Body() body: { token: string }
): Promise<{ message: string; statusCode: number }> {

  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { reset_token: body.token },
  });

  if (
    !user ||
    !user.reset_token_expires_at ||
    user.reset_token_expires_at < new Date()
  ) {
    return { message: "Invalid or expired token", statusCode: 401 };
  }

  return { message: "Token valid", statusCode: 200 };
}


  @Post("/reset-password")
public async resetPassword(
  @Body()
  body: {
    token: string;
    password: string;
    confirm_password: string;
  }
): Promise<{ message: string; statusCode: number }> {

  if (body.password !== body.confirm_password) {
    return { message: "Passwords do not match", statusCode: 422 };
  }

  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { reset_token: body.token },
  });

  if (
    !user ||
    !user.reset_token_expires_at ||
    user.reset_token_expires_at < new Date()
  ) {
    return { message: "Invalid or expired token", statusCode: 401 };
  }

  user.password = await bcrypt.hash(body.password, 10);

  // 🔥 Invalidate token
  user.reset_token = null;
  user.reset_token_expires_at = null;

  await userRepository.save(user);

  return { message: "Password reset successful", statusCode: 200 };
}

  @Post("/forgot-password")
public async forgotPassword(
  @Body() body: { email: string }
): Promise<{ message: string; statusCode: number }> {

  const userRepository = AppDataSource.getRepository(User);

  if (!body.email) {
    return { message: "Email is required", statusCode: 422 };
  }

  const user = await userRepository.findOneBy({ email: body.email });

  // ✅ Do NOT reveal whether user exists
  if (!user) {
    return {
      message: "If the email exists, a reset link has been sent",
      statusCode: 200,
    };
  }

  if (user.status?.toLowerCase() !== "active") {
    return { message: "Account is not active", statusCode: 422 };
  }

  // 🔐 Generate ONE-TIME reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.reset_token = resetToken;
  user.reset_token_expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await userRepository.save(user);

  const resetLink = `${process.env.FRONTEND_URL}user-login/reset-password?token=${resetToken}`;

  await sendForgotPasswordEmail(user.email, resetLink,user.name || "customer");

  return {
    message: "Password reset link sent to your email",
    statusCode: 200,
  };
}
  @Post("/register")
  public async Register(
    @FormField() first_name: string,
    @FormField() surf_name: string,
    @FormField() email: string,
    @FormField() password: string,
    @FormField() confirm_password: string,
    @FormField() account_type: string,
    @FormField() title: string,
    @FormField() phone: string,
    @FormField() emergency_number: string,
    @FormField() date_of_birth: string,
    @FormField() address_1: string,
    @FormField() address_2: string,
    @FormField() address_3: string,
    @FormField() city: string,
    @FormField() county: string,
    @FormField() country: string,
    @FormField() postcode: string,
    @FormField() breeder_check: boolean,
    @FormField() implanter_radio: string,
    @FormField() implanter_pin?: string,
    @FormField() breeder_licence_no?: string,
    @FormField() breeder_local_authority?: string,
    @FormField() dealer_licence_no?: string,
    @FormField() dealer_local_authority?: string,
    @FormField() local_authority?: string,
    @UploadedFile("implanter_certificate") file?: Express.Multer.File
  ): Promise<{ message: string; statusCode?: number }> {
    const userRepository = AppDataSource.getRepository(User);
    const breederRepository = AppDataSource.getRepository(BreederDetail);

    return await AppDataSource.manager.transaction(async (manager) => {
      // Construct full body
      // Construct full body with explicit type-safe mapping

      const body = {
        first_name: first_name || "",
        surf_name: surf_name || "",
        email: email || "",
        password: password || "",
        confirm_password: confirm_password || "",
        account_type: account_type || "",
        title: title || "",
        phone: phone || "",
        emergency_number: emergency_number || "",
        date_of_birth: date_of_birth || "",
        address_1: address_1 || "",
        address_2: address_2 || "",
        address_3: address_3 || "",
        city: city || "",
        county: county || "",
        country: country || "",
        postcode: postcode || "",
        breeder_check: breeder_check ?? false,
        implanter_radio: implanter_radio || "",
        implanter_pin: implanter_pin || "",
        breeder_licence_no: breeder_licence_no || "",
        breeder_local_authority: breeder_local_authority || "",
        dealer_licence_no: dealer_licence_no || "",
        dealer_local_authority: dealer_local_authority || "",
        local_authority: local_authority || "",
      };

      console.log("Registration body:", body);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const fullName = `${first_name} ${surf_name}`.trim();

      // Check existing email
      const existingUser = await manager.findOne(User, { where: { email } });
      if (existingUser) {
        return { message: "Email is already registered", statusCode: 400 };
      }

      // Determine status
      const status = ["3", "4", "5", "6","1"].includes(String(account_type))
        ? "in_active"
        : "active";

      // Save user
      const user = userRepository.create({
        ...body,
        name: fullName,
        password: hashedPassword,
        type: "pet_owner",
        status,
      });
      const savedUser = await manager.save(user);

      // Save breeder details if needed
      if (!["0", "3", "6"].includes(String(account_type))) {
        let implanterPath = "";
        if (file && implanter_radio === "implanter_certificate") {
          const uploadDir = `${process.cwd()}/uploads/breeder_details`;
          if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
          const filename = `${Date.now()}_${file.originalname}`;
          const filepath = `${uploadDir}/${filename}`;
          fs.writeFileSync(filepath, file.buffer);
          implanterPath = `uploads/breeder_details/${filename}`;
        }

        const breeder = breederRepository.create({
          user_id: savedUser.id,
          implanter_type: implanter_radio,
          implanter_pin:
            implanter_radio === "implanter_pin" ? implanter_pin : implanterPath,
          breeder_licence_no,
          breeder_local_authority,
          dealer_licence_no,
          dealer_local_authority,
          local_authority,
        });

        await manager.save(breeder);
      }

let token: string | undefined = undefined;

      if (savedUser.status === "active") {
        token = jwt.sign(
          {
            userId: savedUser.id,
            email: savedUser.email,
            user_type: savedUser.type,
            user_name: savedUser.name,
            account_type: savedUser.account_type,
          },
          process.env.JWT_SECRET || "your_jwt_secret_key",
          { expiresIn: "5h" }
        );
        return { message: "Registered Successfully", token, statusCode: 201 };
      } else {
        return {
          message: "Registration successful but account is inactive. Please wait for approval.",
          statusCode: 201,
        };
      }
    });
    
  }

  @Get("/validate-token")
  public async ValidateToken(
    @Request() request: AuthenticatedRequest
  ): Promise<{ message: string; statusCode?: number; data?: any }> {
    const token = request.headers["authorization"]?.split(" ")[1]; // Assumes 'Bearer <token>' format

    if (!token) {
      return { message: "Token is required", statusCode: 403 };
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret_key"
      ) as {
        userId: number;
        email: string;
        user_name: string;
        avatar_original: string;
        account_type: string;
      };

      // Attach user data to request (optional)
      request.user = decoded;

      return { message: "Token is valid", data: decoded, statusCode: 200 };
    } catch (error) {
      return { message: "Invalid or expired token", statusCode: 401 };
    }
  }

  @Post("/send/otp")
  public async ResetPassword(
    @Body() body: ResetPasswordRequest
  ): Promise<{ message: string; statusCode?: number; data?: any }> {
    console.log("Request Body:", body.email); // Log the email for debugging

    const userRepository = AppDataSource.getRepository(User);

    // Check if the user already exists
    const existingUser = await userRepository.findOne({
      where: { email: body.email, type: "customer" },
      select: ["id", "name", "type", "email", "password", "otp"], // Ensure `id` is selected (to check primary key)
    });

    // Log the user query result to verify it's returning the expected user
    console.log("Existing User:", existingUser);

    if (!existingUser) {
      return { message: "Invalid Email ID", statusCode: 422 }; // No user found, return error
    }

    // Generate OTP
    const otp = randomInt(100000, 999999);
    existingUser.otp = otp.toString(); // Assign the OTP to the existing user

    // Log OTP assignment
    console.log("Assigned OTP:", existingUser.otp);

    try {
      // Save the updated user with the OTP
      const savedUser = await userRepository.save(existingUser);
    } catch (error) {
      console.error("Error saving OTP to user:", error);
      return { message: "Error saving OTP", statusCode: 500 };
    }

    // Prepare and send email
    const emailTemplate = fs.readFileSync("./public/email/otp.html", "utf-8");
    const data = existingUser as User & { url?: string };

    // Hash the OTP and email together for a secure token
    const hashedToken = crypto
      .createHash("sha256")
      .update(`${body.email}:${otp}`)
      .digest("hex");

    // Create the reset password URL with the hashed token
    const url = `${process.env.FRONTEND_URL}auth/reset-password/${hashedToken}`;
    data.url = url;

    const renderedEmail = ejs.render(emailTemplate, data);
    const mailOptions = {
      from: process.env.ADMIN_FROM_EMAIL,
      to: existingUser.email, // Send OTP to the user's email
      subject: "Password Reset",
      html: renderedEmail, // OTP message
    };

    try {
      await transporter.sendMail(mailOptions);
      return { message: "OTP sent successfully", data: data, statusCode: 200 };
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return { message: "Failed to send OTP email", statusCode: 500 };
    }
  }

  @Post("/change/password")
  public async changePassword(
    @Body() body: { token: string; confirm_password: string }
  ): Promise<{ message: string; statusCode?: number }> {
    const userRepository = AppDataSource.getRepository(User);

    try {
      const { token, confirm_password } = body;

      if (!token || !confirm_password) {
        return { message: "Token and password are required.", statusCode: 400 };
      }

      // Extract the email and OTP from the hashed token
      const users = await userRepository.find(); // Fetch all users to match email and OTP
      let matchedUser = null;

      for (const user of users) {
        const hashedToken = crypto
          .createHash("sha256")
          .update(`${user.email}:${user.otp}`)
          .digest("hex");

        if (hashedToken === token) {
          matchedUser = user;
          break;
        }
      }

      if (!matchedUser) {
        return { message: "Invalid Token", statusCode: 400 };
      }

      // Ensure we are updating the existing user (not creating a new one)
      matchedUser.password = await bcrypt.hash(confirm_password, 10); // Update with the hashed password
      matchedUser.otp = ""; // Clear the OTP as it is single-use

      // Save the updated user without creating a new one
      await userRepository.save(matchedUser);

      return { message: "Password updated successfully.", statusCode: 200 };
    } catch (error) {
      console.error("Error changing password:", error);
      return { message: "Failed to change password.", statusCode: 500 };
    }
  }
}
