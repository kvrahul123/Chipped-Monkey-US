import {
  Get,
  Route,
  Controller,
  Path,
  Security,
  Request,
  Patch,
  Body,
  Post,
} from "tsoa";
import { Not, In } from "typeorm";
import { AppDataSource } from "../../data-source";
import crypto, { randomInt } from "crypto";

import { User } from "../../entities/User";
import { decodeToken, getTokenFromRequest } from "../utilities/TokenUtility";
import { Uploads } from "../../entities/Uploads";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
}


@Route("profile")
export class ProfileController extends Controller {
  @Security("jwt")
  @Get("/edit")
  public async getProfileForEdit(
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }
        console.log("decodedToken::"+JSON.stringify(decodedToken));

        const userRepository = AppDataSource.getRepository(User);
            const uploadRepository = AppDataSource.getRepository(Uploads);


      const user = await userRepository.findOne({
        where: { id: decodedToken.userId },
      });

      if (!user) {
        return { message: "User not found", statusCode: 404 };
      }
        
         // Function to get Upload data from ID or comma-separated IDs
    const getUploadFiles = async (field?: string | null) => {
      if (!field) return [];
      const ids = field.split(",").map((id) => parseInt(id, 10));
      const files = await uploadRepository.findByIds(ids);
      return files.map((f) => ({ id: f.id, file_name: f.file_name }));
    };

    const imageData = await getUploadFiles(user.company_logo);

      return {
        message: "User fetched successfully",
          data: {
            ...user,
            imageData: imageData, 
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch profile details", statusCode: 422 };
    }
  }

    @Post("/update")
  public async updateProfile(
    @Request() request: any,
    @Body() body: Partial<User>
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { id: decodedToken.userId },
      });

      if (!user) {
        return { message: "User not found", statusCode: 404 };
      }

       if (body.email && body.email !== user.email) {
      const existingUser = await userRepository.findOne({
        where: { email: body.email },
      });

      if (existingUser) {
        return {
          message: "Email already in use by another user",
          statusCode: 409, // conflict
        };
      }
    }

      // update all fields from body (only if they exist)
      user.company_logo = body.company_logo ?? user.company_logo;
      user.name = body.name ?? user.name;
      user.company_name = body.company_name ?? user.company_name;
      user.email = body.email ?? user.email;
      user.phone = body.phone ?? user.phone;
      user.emergency_number = body.emergency_number ?? user.emergency_number;
      user.address_1 = body.address_1 ?? user.address_1;
      user.address_2 = body.address_2 ?? user.address_2;
      user.address_3 = body.address_3 ?? user.address_3;
      user.city = body.city ?? user.city;
      user.country = body.country ?? user.country;
      user.postcode = body.postcode ?? user.postcode;
      user.small_description =
        body.small_description ?? user.small_description;
    if (!user.slug || user.slug.trim() === "") {
      let baseSlug = slugify(user.company_name || "user").toLowerCase();
      let uniqueSlug = baseSlug;
      let counter = 1;

      // check uniqueness in DB
      while (
        await userRepository.findOne({ where: { slug: uniqueSlug } })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      user.slug = uniqueSlug;
    }
      const updatedUser = await userRepository.save(user);

      return {
        message: "Profile updated successfully",
        data: updatedUser,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to update profile", statusCode: 422 };
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
        let matchedUser = null;
        const decoded = jwt.verify(token,
          process.env.JWT_SECRET || "your_jwt_secret_key");
        if (decoded && typeof decoded === 'object' && 'email' in decoded) {
          const email = (decoded as JwtPayload).email as string;
          matchedUser = await userRepository.findOne({ where: { email } });

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
