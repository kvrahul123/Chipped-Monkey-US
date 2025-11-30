import {
  Get,
  Route,
  Controller,
  Query,
  Post,
  Body,
  Delete,
  Path,
  Patch,
  Security,
  Request,
  Put,
} from "tsoa";
import { AppDataSource } from "../../data-source";
import { IsNull, DeepPartial, In } from "typeorm";
import { decode, verify } from "jsonwebtoken";

import { getTokenFromRequest, decodeToken } from "../utilities/TokenUtility";
import { Uploads } from "../../entities/Uploads";
import { TransactionRequest } from "../../entities/TransactionRequest";
import { User } from "../../entities/User";
import { MicrochipOrders } from "../../entities/MicrochipOrders";

@Route("transaction_request")
export class TransactionRequestController extends Controller {
  @Get("/lists")
  public async getTransactionRequestLists(): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const transactionrequestRepository =
        AppDataSource.getRepository(TransactionRequest);
      const userRepository = AppDataSource.getRepository(User);
      const transactionrequest = await transactionrequestRepository.find({order:{id:"DESC"} });

      if (!transactionrequest.length) {
        return { message: "No Transaction Request found", statusCode: 422 };
      }

      const data = await Promise.all(
        transactionrequest.map(async (request) => {
          let userName = null;
          if (request.user_id) {
            const user = await userRepository.findOneBy({
              id: request.user_id,
            });
            userName = user ? user.name : null;
          }

          return {
            ...request,
            user_name: userName, // Add user_name field
          };
        })
      );

      return {
        message: "Transaction Request retrieved successfully",
        data: data,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Failed to retrieve Transaction Request",
        statusCode: 422,
      };
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
    data?: TransactionRequest;
  }> {
    try {
      const transactionRequestRepository =
        AppDataSource.getRepository(TransactionRequest);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (decodedToken && typeof decodedToken === "object") {
        if (
          decodedToken.user_type === "Admin" || decodedToken.user_type === "supervisor" ||
          decodedToken.user_type == "chipped_monkey_admin"
        ) {
          const category = await transactionRequestRepository.findOne({ where: { id } });

          if (!category) {
            this.setStatus(404); // Not Found
            return { message: "Transaction Request not found", statusCode: 404 };
          }

          // Update the featured status
          category.status = body.status;
          await transactionRequestRepository.save(category);

          return {
            message: "Transaction Request status updated successfully",
            statusCode: 200,
            data: category,
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
      return { message: "Failed to update Transaction Request status", statusCode: 500 };
    }
  }

  @Security("jwt")
  @Delete("/delete/{id}")
  public async deleteTransactionRequest(
    @Path() id: number,
    @Request() request: any
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    try {
      const transactionrequestRepository =
        AppDataSource.getRepository(TransactionRequest);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (decodedToken && typeof decodedToken === "object") {
        const transactionrequest = await transactionrequestRepository.findOne({
          where: { id },
        });

        if (!transactionrequest) {
          return { message: "Transaction Request not found", statusCode: 404 };
        }
        await transactionrequestRepository.remove(transactionrequest);
      } else {
        return { message: "Token not found", statusCode: 404 };
      }
      return {
        message: "Transaction Request deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.error(error); // Log the error
      return {
        message: "Failed to delete Transaction Request",
        statusCode: 422,
      };
    }
  }
}
