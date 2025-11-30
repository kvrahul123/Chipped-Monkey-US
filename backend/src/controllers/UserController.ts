import {
  Get,
  Route,
  Controller,
  Path,
  Security,
  Request,
  Patch,
  Body,
} from "tsoa";
import { Not, In } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { decodeToken, getTokenFromRequest } from "../utilities/TokenUtility";
import { Uploads } from "../../entities/Uploads";
import { ImplantersAmount } from "../../entities/ImplantersAmount";

@Route("users")
export class UserController extends Controller {
  @Security("jwt")
  @Get("/lists/:type")
  public async getUsersLists(
    @Path() type: string,
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      // Validate JWT
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const userRepository = AppDataSource.getRepository(User);
      let users: User[] = [];

      // Map type to account_type
      if (type === "other_users") {
        users = await userRepository.find({
          where: { account_type: Not(In([0, 1, 2])) },
        });
      } else {
        const typeMap: Record<string, number> = {
          pet_owner: 0,
          microchip_implanters: 1,
          breeders: 2,
        };

        const userType = typeMap[type];

        if (userType === undefined) {
          return { message: "Invalid user type", statusCode: 422 };
        }

        users = await userRepository.find({
          where: { account_type: String(userType) },
        });
      }

      if (!users.length) {
        return { message: "No users found", statusCode: 404 };
      }

      // Optional: map additional fields, e.g., upload files, etc.
      const usersWithDetails = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        account_type: user.account_type,
        // add more fields here if needed
      }));

      return {
        message: "Users fetched successfully",
        data: usersWithDetails,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch users", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/listsdata")
  public async getUsersListsDATA(
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      // Validate JWT
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const userRepository = AppDataSource.getRepository(User);
      const uploadRepository = AppDataSource.getRepository(Uploads);
      let users: User[] = [];

      users = await userRepository.find({ where: { account_type: In([1]) } });

      if (!users.length) {
        return { message: "No users found", statusCode: 404 };
      }
      const uploads = await uploadRepository.find();
      // Optional: map additional fields, e.g., upload files, etc.
      const usersWithDetails = users.map((user) => {
        const logoFile = uploads.find((u) => u.id == user.company_logo);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          account_type: user.account_type,
          company_logo: logoFile ? logoFile.file_name : null, // assign filename
          address: [
            user.address_1,
            user.address_2,
            user.address_3
          ]
            .filter(Boolean) // removes undefined, null, empty string
            .join(", "),
        };
      });

      return {
        message: "Users fetched successfully",
        data: usersWithDetails,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch users", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Patch("{id}/status")
  public async updateTransactionRequestStatus(
    @Path() id: any,
    @Body() body: { status: any },
    @Request() request: any
  ): Promise<{
    message: string;
    statusCode: number;
    data?: User;
  }> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const implanterAmountRepository = AppDataSource.getRepository(ImplantersAmount);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (decodedToken && typeof decodedToken === "object") {
        if (
          decodedToken.user_type === "Admin" ||
          decodedToken.user_type == "chipped_monkey_admin" ||
          decodedToken.user_type == "supervisor"
        ) {
          const users = await userRepository.findOne({ where: { id } });

          if (!users) {
            this.setStatus(404); // Not Found
            return { message: "User not found", statusCode: 404 };
          }
          const implanterAmount = await implanterAmountRepository.findOne({ where: { user_id: id } });
          if (!implanterAmount) {
            return {
              message: "Implanter amount record not found",
              statusCode: 422,   
            }
          }

          // Update the featured status
          users.status = body.status;
          await userRepository.save(users);

          return {
            message: "User status updated successfully",
            statusCode: 200,
            data: users,
          };
        } else {
          return {
            message: "Invalid user type",
            statusCode: 200,
            data: undefined,
          };
        }
      } else {
        return {
          message: "No token provided",
          statusCode: 200,
          data: undefined,
        };
      }
    } catch (error) {
      console.error(error); // Log the error
      this.setStatus(500); // Internal Server Error
      return {
        message: "Failed to update Transaction Request status",
        statusCode: 500,
      };
    }
  }
}
