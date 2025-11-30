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
import { OrderStatus } from "../../entities/MicrochipOrders";

import { getTokenFromRequest, decodeToken } from "../utilities/TokenUtility";
import { Uploads } from "../../entities/Uploads";
import { MicrochipOrders } from "../../entities/MicrochipOrders";
import { User } from "../../entities/User";
import { AssignedMicrochip } from "../../entities/AssignedMicrochip";
import { Contact } from "../../entities/Contact";
import { TransactionRequest } from "../../entities/TransactionRequest";
import { TransactionDetails } from "../../entities/TransactionDetails";
import nodemailer from "nodemailer"; // Import nodemailer
import fs from "fs";
import path from "path";
import { ImplantedMicrochip } from "../../entities/ImplantedMicrochip";
import { ImplantersAmount } from "../../entities/ImplantersAmount";
interface CreateMicrochipOrderRequest {
  microchip_count: number;
  status: OrderStatus;
  id: number;
  email?: string;
}

interface CreateAssignedMicrochipOrderRequest {
  order_id: string;
  assigned_numbers: string[];
  assigned_to?: string;
  microchip_count: number;
  OP_id?: string;
}

@Route("microchip_orders")
export class MicrochipOrdersController extends Controller {
  @Security("jwt")
  @Post("/create")
  public async createOrUpdateMicrochipOrder(
    @Body() body: CreateMicrochipOrderRequest,
    @Request() request: any
  ): Promise<{
    message: string;
    data?: any;
    statusCode: number;
  }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found", statusCode: 404 };
      }

      const microchipOrderRepository =
        AppDataSource.getRepository(MicrochipOrders);
      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);
      // 🔹 If ID exists, update
      if (body.id && body.id != 0) {
        const existingOrder = await microchipOrderRepository.findOne({
          where: { id: Number(body.id) },
        });

        if (!existingOrder) {
          return {
            message: "Order not found",
            statusCode: 404,
          };
        }

        const assignedChips = await assignedMicrochipRepository.findOne({
          where: { order_id: String(existingOrder.id) },
        });

        if (assignedChips) {
          return {
            message:
              "Cannot update order as microchips have already been assigned.",
            statusCode: 422,
          };
        }

        // update fields
        existingOrder.microchip_count = Number(body.microchip_count);

        if (
          decodedToken.user_type == "Admin" ||
          decodedToken.user_type == "supervisor"
        ) {
          existingOrder.status = body.status;
        }

        const updatedOrder = await microchipOrderRepository.save(existingOrder);

        return {
          message: `Microchip Order updated successfully ${decodedToken.user_type}`,
          data: updatedOrder,
          statusCode: 200,
        };
      }

      // 🔹 Else create new
      let userID;
      if (body.email && body.email !== "") {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { email: body.email },
        });
        userID = user?.id;
      } else {
        userID = Number(decodedToken.userId);
      }
      const newOrder = microchipOrderRepository.create({
        user_id: userID,
        microchip_count: Number(body.microchip_count),
        date: new Date().toISOString().split("T")[0],
        status:
          decodedToken.user_type !== "Admin"
            ? OrderStatus.PENDING
            : body.status || OrderStatus.PENDING,
        order_id: "ORD-" + Math.random().toString(36).substring(2, 10),
      });

      const savedOrder = await microchipOrderRepository.save(newOrder);

      return {
        message: "Microchip Order created successfully",
        data: savedOrder,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error creating/updating microchip order:", error);
      return {
        message: "Failed to create or update Microchip Order",
        statusCode: 422,
      };
    }
  }

  @Post("/assigned_microchips/create")
  public async createMicrochipAssignedOrder(
    @Body() body: CreateAssignedMicrochipOrderRequest,
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      const contactRepository = AppDataSource.getRepository(Contact);
      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found", statusCode: 404 };
      }

      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);
      const microchipOrderRepository =
        AppDataSource.getRepository(MicrochipOrders);

      const { assigned_numbers, assigned_to } = body;

      // 1️⃣ Check duplicates in same request
      const uniqueAssignedNumbers = Array.from(new Set(assigned_numbers));
      if (uniqueAssignedNumbers.length !== assigned_numbers.length) {
        return {
          message: "Duplicate microchip numbers found in request.",
          statusCode: 409,
        };
      }

      // 2️⃣ Check if any microchip numbers already exist in DB
      const existings = await assignedMicrochipRepository.find({
        where: { microchip_number: In(uniqueAssignedNumbers) },
        select: ["microchip_number"],
      });

      const contactExistings = await contactRepository.find({
        where: { microchip_number: In(uniqueAssignedNumbers) },
        select: ["microchip_number"],
      });

      if (existings.length > 0 || contactExistings.length > 0) {
        const existingNumbers = [
          ...existings.map((e) => e.microchip_number?.trim()),
          ...contactExistings.map((e) => e.microchip_number?.trim()),
        ];

        return {
          message: `Some microchip numbers are already assigned.`,
          data: existingNumbers,
          statusCode: 409,
        };
      }

      // 3️⃣ All validations passed — now create main order
      let order_id = body.OP_id;
      let savedOrder;
      if (!body.OP_id || body.OP_id === "") {
        const newOrder = microchipOrderRepository.create({
          order_id: "ORD-" + Math.random().toString(36).substring(2, 10),
          user_id: Number(assigned_to),
          microchip_count: Number(body.microchip_count),
          date: new Date().toISOString().split("T")[0],
          status: OrderStatus.PENDING,
        });

        savedOrder = await microchipOrderRepository.save(newOrder);
        order_id = String(savedOrder.id);
      } else {
        const existingOrder = await microchipOrderRepository.findOne({
          where: { id: Number(body.OP_id) },
        });

        if (!existingOrder) {
          return {
            message: "Order not found",
            statusCode: 404,
          };
        }

        // Update the order
        existingOrder.microchip_count = Number(body.microchip_count);
        savedOrder = await microchipOrderRepository.save(existingOrder);
        order_id = String(savedOrder.id);
      }

      // 4️⃣ Create assigned microchip entries
      const entities = uniqueAssignedNumbers.map((chip) =>
        assignedMicrochipRepository.create({
          order_id,
          microchip_number: chip,
          assigned_to: Number(assigned_to) ?? "",
          date: new Date(),
          status: "active",
        })
      );

      await assignedMicrochipRepository.save(entities);

      return {
        message: "Microchip Order created successfully",
        data: savedOrder,
        statusCode: 201,
      };
    } catch (error) {
      console.error("Error creating microchip order:", error);
      return {
        message: "Failed to create Microchip Order",
        statusCode: 422,
      };
    }
  }

  @Security("jwt")
  @Get("/lists")
  public async getMicrochipOrderLists(@Request() request: any): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found", statusCode: 404 };
      }

      const microchipOrderRepository =
        AppDataSource.getRepository(MicrochipOrders);
      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);

      let microchipOrders;
      if (
        decodedToken.user_type != "Admin" &&
        decodedToken.user_type != "supervisor"
      ) {
        microchipOrders = await microchipOrderRepository.find({
          where: { user_id: Number(decodedToken.userId) },
        });
      } else {
        microchipOrders = await microchipOrderRepository.find();
      }

      const userRepository = AppDataSource.getRepository(User);

      if (!microchipOrders.length) {
        return { message: "No lists found", statusCode: 422 };
      }

      const data = await Promise.all(
        microchipOrders.map(async (order) => {
          const user = await userRepository.findOne({
            where: { id: Number(order.user_id) },
          });
          const assignedChips = await assignedMicrochipRepository.findOne({
            where: { order_id: String(order.id) },
          });
          return {
            ...order,
            userName: user?.name || null,
            address: [user?.address_1, user?.address_2, user?.address_3]
              .filter(Boolean) // removes null, undefined, empty
              .join(" "),
            is_assigned: assignedChips ? true : false,
          };
        })
      );

      return {
        message: "Microchip Order retrieved successfully",
        data: data,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve Microchip Order", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/views/:id")
  public async getMicrochipOrderViews(@Request() request: any): Promise<{
    message: string;
    data?: any;
    statusCode: number;
  }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found", statusCode: 404 };
      }

      const microchipOrderRepository =
        AppDataSource.getRepository(MicrochipOrders);
      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);
      const userRepository = AppDataSource.getRepository(User);
      const implantedMicrochipRepository =
        AppDataSource.getRepository(ImplantedMicrochip);

      let microchipOrder: any = null;
      let assignedChips: any[] = [];

      // 🔒 If not admin/supervisor → restrict to their own orders
      if (
        decodedToken.user_type !== "Admin" &&
        decodedToken.user_type !== "supervisor"
      ) {
        microchipOrder = await microchipOrderRepository.findOne({
          where: {
            order_id: String(request.params.id),
            user_id: Number(decodedToken.userId),
          },
        });
      } else {
        // 👑 Admin or Supervisor → can see all
        microchipOrder = await microchipOrderRepository.findOne({
          where: { order_id: String(request.params.id) },
        });
      }

      if (!microchipOrder) {
        return { message: "Microchip Order not found", statusCode: 404 };
      }

      // 🔍 Fetch assigned chips for the order
      assignedChips = await assignedMicrochipRepository.find({
        where: { order_id: String(microchipOrder.id) },
      });
      const user = await userRepository.findOne({
        where: { id: Number(microchipOrder.user_id) },
      });
      const implantedChips = await implantedMicrochipRepository.find({
        where: { status: In(["Active"]) },
      });

      // 🧩 Combine and structure the response
      const assigned_chips = await Promise.all(
        assignedChips.map(async (chip) => {
          if (!chip.used_by) {
            // Skip DB lookup if no assigned user
            return {
              microchipNumber: chip.microchip_number,
              isAssigned: "",
              breeder_name:
                implantedChips.find(
                  (implanted) => implanted.microchip_number == chip.id
                )?.breeder_name || "",
              breeder_email:
                implantedChips.find(
                  (implanted) => implanted.microchip_number == chip.id
                )?.breeder_email || "",
              breeder_phone:
                implantedChips.find(
                  (implanted) => implanted.microchip_number == chip.id
                )?.breeder_phone || "",
              microchipID: chip.id,
            };
          }

          const user = await userRepository.findOne({
            where: { id: chip.used_by },
          });

          return {
            microchipNumber: chip.microchip_number,
            isAssigned: user ? user.name : "Unassigned",
            breeder_name:
              implantedChips.find(
                (implanted) => implanted.microchip_number == chip.id
              )?.breeder_name || "",
            breeder_email:
              implantedChips.find(
                (implanted) => implanted.microchip_number == chip.id
              )?.breeder_email || "",
            breeder_phone:
              implantedChips.find(
                (implanted) => implanted.microchip_number == chip.id
              )?.breeder_phone || "",
            microchipID: chip.id,
          };
        })
      );

      const data = {
        order_id: microchipOrder.order_id,
        implanter_name: microchipOrder.implanter_name,
        phone: user?.phone,
        name: user?.name,
        email: user?.email,
        address: [user?.address_1, user?.address_2, user?.address_3]
          .filter(Boolean)
          .join(" "),
        microchip_count: microchipOrder.microchip_count,
        date: microchipOrder.date,
        status: microchipOrder.status,
        assigned_chips,
      };

      return {
        message: "Microchip Order retrieved successfully",
        data,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error retrieving Microchip Order:", error);
      return {
        message: "Failed to retrieve Microchip Order",
        statusCode: 422,
      };
    }
  }

  @Get("/microchip/lists/:id")
  public async getMicrochipOrderListsById(@Path() id: string): Promise<{
    message: string;
    data?: any;
    statusCode: number;
  }> {
    try {
      const microchipOrderRepository =
        AppDataSource.getRepository(MicrochipOrders);
      const microchipOrders = await microchipOrderRepository.findOne({
        where: { order_id: String(id) },
      });
      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);
      const assignedChips = await assignedMicrochipRepository.find({
        where: { order_id: String(microchipOrders?.id) },
      });
      const userRepository = AppDataSource.getRepository(User);

      if (!microchipOrders) {
        return { message: "No orders found", statusCode: 404 };
      }
      const data = {
        ...microchipOrders,
        assigned_chips: assignedChips.length,
      };
      return {
        message: "Microchip Order retrieved successfully",
        data: data,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve Microchip Order", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/assigned/lists/:id")
  public async getAssignedMicrochipOrderLists(
    @Request() request: any,
    @Path() id: number
  ): Promise<{ message: string; data?: any[]; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const microchipOrderRepository =
        AppDataSource.getRepository(AssignedMicrochip);
      let whereCondition: any = { order_id: String(id) };

      if (
        decodedToken.user_type !== "Admin" &&
        decodedToken.user_type !== "supervisor"
      ) {
        whereCondition.assigned_to = Number(decodedToken.userId);
      }

      const microchipOrders = await microchipOrderRepository.find({
        where: whereCondition,
      });

      if (!microchipOrders.length) {
        return { message: "No orders found", statusCode: 404 };
      }

      return {
        message: "Microchip Order retrieved successfully",
        data: microchipOrders,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve Microchip Order", statusCode: 500 };
    }
  }

  @Security("jwt")
  @Get("/assigned/details/:id")
  public async getAssignedMicrcohipDetails(
    @Request() request: any,
    @Path() id: string
  ): Promise<{ message: string; data?: any[]; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const transactionRequestRepository = await AppDataSource.getRepository(
        TransactionRequest
      );
      const transactionRequest = await transactionRequestRepository.findOne({
        where: { transaction_id: String(id) },
      });

      const microchipOrderRepository =
        AppDataSource.getRepository(AssignedMicrochip);

      const microchipOrders = await microchipOrderRepository.find({
        where: {
          assigned_to: transactionRequest?.user_id,
          transfer_request_id: Number(transactionRequest?.id),
          status: In(["active"]),
        },
      });

      if (!microchipOrders.length) {
        return { message: "No details found", statusCode: 404 };
      }
      const transactionRepo = AppDataSource.getRepository(TransactionDetails);
      const commisionRepo = AppDataSource.getRepository(ImplantersAmount);
      const transactions = await transactionRepo.find({
        where: {
          transactionRequest_id: transactionRequest?.id,
        },
      });
      const microchipDetails = await Promise.all(
        microchipOrders.map(async (chip) => {
          const userRepository = AppDataSource.getRepository(User);

          // If used_by is null, skip lookup
          if (!chip.used_by) {
            return {
              date: chip.date,
              microchip_number: chip.microchip_number,
              used_by: "Unassigned",
            };
          }

          // Otherwise, fetch the user
          const user = await userRepository.findOne({
            where: { id: chip.used_by },
          });

          return {
            date: chip.date,
            microchip_number: chip.microchip_number,
            used_by: user ? user.name : "-",
          };
        })
      );

      let commisionDetails = await commisionRepo.findOne({
        where: { user_id: transactionRequest?.user_id },
      });
      let commisionAmount = 0;
      if (commisionDetails && commisionDetails.type == "amount") {
        commisionAmount = Number(commisionDetails.value);
      } else {
        commisionAmount = 10 * (Number(commisionDetails?.value) / 100);
      }

      const data = {
        isMoneySent: transactions?.length,
        trasactionId: transactionRequest?.transaction_id,
        accountHolderName: transactionRequest?.account_holders_name,
        bankName: transactionRequest?.bank_name,
        sortCode: transactionRequest?.sort_code,
        requestedAmount: transactionRequest?.requested_amount,
        totalMicrochip: microchipOrders.length,
        registeredMicrochip: microchipOrders.filter(
          (chip) => chip.used_by !== null
        ).length,
        pendingMicrochip:
          microchipOrders.length -
          microchipOrders.filter((chip) => chip.used_by != null).length,
        totalRevenue: Number(
          (
            microchipOrders.filter((chip) => chip.used_by !== null).length *
            commisionAmount
          ).toFixed(2)
        ),

        microchiDetails: microchipDetails,
      };

      return {
        message: "Microchip Order details retrieved successfully",
        data: [data],
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve Microchip Order", statusCode: 500 };
    }
  }

  @Security("jwt")
  @Delete("/delete/{id}")
  public async deleteMicrochipOrder(
    @Path() id: number,
    @Request() request: any
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    try {
      const MicrochipRepository = AppDataSource.getRepository(MicrochipOrders);
      const AssignedOrdersRepository =
        AppDataSource.getRepository(AssignedMicrochip);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (decodedToken && typeof decodedToken === "object") {
        const microchipOrder = await MicrochipRepository.findOne({
          where: { id },
        });

        if (!microchipOrder) {
          return { message: "Microchip Order not found", statusCode: 404 };
        }

        const assignedChips = await AssignedOrdersRepository.findOne({
          where: { order_id: String(microchipOrder.id) },
        });

        if (assignedChips) {
          return {
            message:
              "Cannot delete order as microchips have already been assigned.",
            statusCode: 422,
          };
        }
        const assignedOrders = await AssignedOrdersRepository.find({
          where: { order_id: String(microchipOrder.id) },
        });
        await MicrochipRepository.remove(microchipOrder);
        await AssignedOrdersRepository.remove(assignedOrders);
      } else {
        return { message: "Token not found", statusCode: 404 };
      }
      return {
        message: "Microchip Order deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      console.error(error); // Log the error
      return { message: "Failed to delete Microchip Order", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Post("/create/transactionDetails")
  public async createTransaction(
    @Body()
    body: {
      transactionRequest_id?: string;
      amount: number;
      message: string;
      date?: string;
      status?: string;
    },
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      // 🔹 Extract and verify JWT token
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      // 🔹 Validate required fields
      if (!body.amount || Number(body.amount) <= 0) {
        return { message: "Amount must be greater than 0", statusCode: 400 };
      }

      if (!body.message || body.message.trim() === "") {
        return { message: "Message (reason) is required", statusCode: 400 };
      }

      const transactionRepo = AppDataSource.getRepository(TransactionDetails);
      const userRepository= AppDataSource.getRepository(User);

      const transactionRequestRepo =
        AppDataSource.getRepository(TransactionRequest);
      const transaction = await transactionRequestRepo.findOne({
        where: { transaction_id: String(body.transactionRequest_id) },
      });
      // 🔹 Create new transaction entry
      const newTransaction = transactionRepo.create({
        transactionRequest_id: Number(transaction?.id) || 0,
        amount: Number(body.amount),
        message: body.message.trim(),
        date: body.date || new Date().toISOString().split("T")[0],
        status: body.status || "Pending",
      });

      const savedTransaction = await transactionRepo.save(newTransaction);
      // 🔹 Update the parent TransactionRequest status to "completed"
      await transactionRequestRepo.update(
        { transaction_id: body.transactionRequest_id },
        { status: "completed" }
      );

      const user = await userRepository.findOne({
        where: { id: transaction?.user_id },
      });

       
    // 🔹 Send Email after successful transaction
    const templatePath = path.join(__dirname, "../../public/email/commisionTemplate.html");
    let template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders in your template
    const html = template
      .replace("**[Customer Name]**", transaction?.account_holders_name || "Customer")
      .replace("**[Customer Account Number/ID]**", transaction?.account_number || "")
      .replace("**[Transfer Amount & Currency, e.g., £0]**", `$${savedTransaction.amount}`)
      .replace("**[Transaction Reference Number]**", String(body.transactionRequest_id))
      .replace("**[Date and Time]**", new Date().toLocaleString())
      .replace("**[Admin/Company Name]**", "Chipped Monkey") // or dynamically from decodedToken
      .replace("**[Your Company Name]**", "Chipped Monkey Ltd")
       .replace("**[Transfer Reason]**",  body.message)
      .replace("**[Your Address/Link]**", "https://chippedmonkey.co.uk");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    try {
      await transporter.sendMail({
        from: `"Chipped Monkey" <${process.env.SMTP_USERNAME}>`,
        to: user?.email, // assuming you have customer_email in transactionRequest
        subject: `Funds Deposit Confirmation - $${savedTransaction.amount}`,
        html: html,
      });
    } catch (mailError) {
      console.error("Mail sending failed:", mailError);
    }

      return {
        message: "Transaction created successfully",
        data: savedTransaction,
        statusCode: 201,
      };
    } catch (error) {
      console.error("Error creating transaction:", error);
      return {
        message: "Failed to create transaction",
        statusCode: 500,
      };
    }
  }


  @Security("jwt")
  @Post("/create/implantedMicrochip")
  public async createImplantedMicrochips(
    @Body()
    body:
      | {
          microchip_number: string;
          breeder_name: string;
          breeder_email: string;
          breeder_phone: string;
          status?: string;
        }
      | {
          microchip_number: number;
          breeder_name: string;
          breeder_email: string;
          breeder_phone: string;
          status?: string;
        }[],
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const repo = AppDataSource.getRepository(ImplantedMicrochip);
      const assignedRepo = AppDataSource.getRepository(AssignedMicrochip);
      const items = Array.isArray(body) ? body : [body];

      // ✅ Prepare records but don’t save yet
      const newRecords = items.map((item) => ({
        microchip_number: Number(item.microchip_number),
        breeder_name: item.breeder_name,
        breeder_email: item.breeder_email,
        breeder_phone: item.breeder_phone,
        status: item.status || "Active",
        date: new Date().toISOString().split("T")[0],
      }));

      // ✅ SMTP config
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_EMAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      });

      // ✅ Group by breeder email
      const breederGroups = newRecords.reduce((acc, record) => {
        if (!acc[record.breeder_email]) acc[record.breeder_email] = [];
        acc[record.breeder_email].push(record);
        return acc;
      }, {} as Record<string, typeof newRecords>);

      // ✅ Generate HTML
      const templatePath = path.join(
        __dirname,
        "../../public/email/microchipImplanting.html"
      );
      const template = fs.readFileSync(templatePath, "utf8");

      // ✅ Send all emails first
      for (const [email, records] of Object.entries(breederGroups)) {
        const breederName = records[0].breeder_name || "Breeder";
        const microchipData = await assignedRepo.findOne({
          where: {
            id: Number(records[0].microchip_number),
          },
        });
        // Generate table rows
        const microchipRows = records
          .map(
            (chip) => `
            <tr>
              <td style="padding:12px; border-bottom:1px solid #eee; color:#333;">
                ${microchipData?.microchip_number}
              </td>
            </tr>
          `
          )
          .join("");

        // Replace placeholders
        let html = template
          .replace("**[Customer Name]**", breederName)
          .replace(
            /<tbody>[\s\S]*?<\/tbody>/,
            `<tbody>${microchipRows}</tbody>`
          );
        const mailOptions = {
          from: `"Chipped Monkey" <${process.env.SMTP_USERNAME}>`,
          to: email,
          subject: `Microchip Breeder Assignment Details`,
          html: html,
        };

        // 🧠 Send and check — if fail → stop immediately
        try {
          await transporter.sendMail(mailOptions);
        } catch (mailError) {
          console.error("mail sending failed:", mailError);
          return {
            message: `Error saving breeder`,
            statusCode: 500,
          };
        }
      }

      // ✅ If all emails sent successfully → Save to DB
      const savedRecords = await repo.save(newRecords);

      return {
        message: `${savedRecords.length} microchip(s) saved successfully and email(s) sent.`,
        data: savedRecords,
        statusCode: 201,
      };
    } catch (error) {
      console.error("Error creating implanted microchips:", error);
      return {
        message: "Server error while processing implanted microchips",
        statusCode: 500,
      };
    }
  }

  @Security("jwt")
  @Get("/microchip/implanted/lists")
  public async getMicrochipImplantedList(@Request() request: any): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found", statusCode: 404 };
      }

      const implantedMicrochipRepository =
        AppDataSource.getRepository(ImplantedMicrochip);
      const assignedRepository = AppDataSource.getRepository(AssignedMicrochip);

      // ✅ Only allow non-admin users to fetch
      if (
        decodedToken.user_type === "Admin" ||
        decodedToken.user_type === "supervisor" ||
        decodedToken.user_type == "chipped_monkey_admin"
      ) {
        // ✅ Fetch active implanted microchips
        const implantedOrders = await implantedMicrochipRepository.find({
          where: { status: "Active" },
        });

        if (!implantedOrders || implantedOrders.length === 0) {
          return { message: "No lists found", statusCode: 422 };
        }

        // ✅ Get all microchip_ids from implantedOrders
        const microchipIds = implantedOrders.map(
          (order) => order.microchip_number
        );

        // ✅ Find all assigned microchips matching those IDs
        const assignedMicrochips = await assignedRepository.findByIds(
          microchipIds
        );

        // ✅ Map implanted microchips with their corresponding microchip_number
        const data = implantedOrders.map((order) => {
          const assigned = assignedMicrochips.find(
            (a) => a.id == order.microchip_number
          );

          return {
            ...order,
            microchip_number: assigned ? assigned.microchip_number : null,
          };
        });

        return {
          message: "Microchip orders retrieved successfully",
          data,
          statusCode: 200,
        };
      } else {
        return {
          message: "Invalid user",
          data: [],
          statusCode: 401,
        };
      }
    } catch (error) {
      console.error("Error fetching implanted microchip list:", error);
      return {
        message: "Failed to retrieve Microchip Orders",
        statusCode: 422,
      };
    }
  }
}
