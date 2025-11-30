import {
  Get,
  Route,
  Controller,
  Post,
  Body,
  Delete,
  Path,
  Security,
  Request,
  Put,
  Res,
  TsoaResponse,
} from "tsoa";
import { AppDataSource } from "../../data-source";
import { getTokenFromRequest, decodeToken } from "../utilities/TokenUtility";
import { Contact } from "../../entities/Contact";
import multer from "multer";
import path from "path";
import express from "express";
import { decode } from "punycode";
import { AssignedMicrochip } from "../../entities/AssignedMicrochip";
import { MicrochipPayment } from "../../entities/MicrochipPayment";
import { PackageDetails } from "../../entities/PackageDetails";
import { MicrochipPaymentDetails } from "../../entities/MicrochipPaymentDetails";
import { ImplantersAmount } from "../../entities/ImplantersAmount";
import {
  externalSources,
  checkExternalMicrochip,
} from "../../utils/ExternalMicrochip";

// ===== Multer Storage Setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pet_images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

// ===== Extend Express Request for file typing =====
interface MulterRequest extends express.Request {
  file?: Express.Multer.File;
}

@Route("microchip")
export class MicrochipController extends Controller {
  @Security("jwt")
  @Get("/lists")
  public async getMicrochipLists(@Request() request: any): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (!decodedToken || typeof decodedToken !== "object") {
        return {
          message: "Token not found or invalid",
          statusCode: 401,
        };
      }
      const microchipRepository = AppDataSource.getRepository(Contact);
      const packageTypeRepository = AppDataSource.getRepository(PackageDetails);
      let microchips;

      if (
        decodedToken.user_type === "Admin" ||
        decodedToken.user_type == "supervisor" ||
        decodedToken.user_type === "chipped_monkey_admin"
      ) {
        microchips = await microchipRepository.find({
          order: { id: "DESC" },
        });
      } else {
        microchips = await microchipRepository.find({
          where: { user_id: decodedToken.userId },
          order: { id: "DESC" },
        });
      }

      if (!microchips.length) {
        return { message: "No microchip found", statusCode: 422 };
      }

      const packageTypes = await packageTypeRepository.find();

      // Map package type names to microchips
      microchips = microchips.map((chip) => {
        const packageType = packageTypes.find(
          (pkg) => pkg.id == Number((chip as any).selected_plan)
        );
        return {
          ...chip,
          package_type: packageType ? packageType.package_name : "Not Selected",
        };
      });
      return {
        message: "Microchip retrieved successfully",
        data: microchips,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve Microchip", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/payment/lists")
  public async getMicrochipPaymentLists(
    @Request() request: any
  ): Promise<{ message: string; data?: any[]; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const microchipRepository = AppDataSource.getRepository(Contact);
      const microchipPaymentRepository =
        AppDataSource.getRepository(MicrochipPayment);
      const microchipPaymentDetailsRepository = AppDataSource.getRepository(
        MicrochipPaymentDetails
      );
      const packageTypeRepository = AppDataSource.getRepository(PackageDetails);

      let microchipPayments;

      const userType = String(decodedToken.user_type || "").toLowerCase();

      // Admins → all payments
      if (["admin", "supervisor", "chipped_monkey_admin"].includes(userType)) {
        console.log("Fetching payments for admin/supervisor");
        microchipPayments = await microchipPaymentRepository.find({
          where: { status: "active" },
          order: { id: "DESC" },
        });
      }
      // Normal users → only their payments
      else {
        console.log("Fetching payments for user ID:", decodedToken.userId);
        microchipPayments = await microchipPaymentRepository.find({
          where: { user_id: decodedToken.userId },
          order: { id: "DESC" },
        });
      }

      if (!microchipPayments.length) {
        return { message: "No microchip found", statusCode: 422 };
      }

      // Build final response
      const result = await Promise.all(
        microchipPayments.map(async (payment) => {
          // 1️⃣ Fetch microchip_payment_details (using payment.id)
          const paymentDetails =
            await microchipPaymentDetailsRepository.findOne({
              where: { microchip_order_id: payment.id },
            });

          // If no details → skip record
          if (!paymentDetails) {
            return {
              ...payment,
              pet_name: null,
              pet_keeper: null,
              pet_keeper_email: null,
              microchip_id: null,
              package_type: null,
              total_amount: null,
            };
          }

          // 2️⃣ Fetch microchip using microchip_number
          const microchip = await microchipRepository.findOne({
            where: { id: Number(paymentDetails.microchip_id) },
          });

          // 3️⃣ Get package details
          const packageDetails = await packageTypeRepository.findOne({
            where: { id: Number(payment.package_id) },
          });

          return {
            ...payment,
            pet_name: microchip?.pet_name ?? null,
            pet_keeper: microchip?.pet_keeper ?? null,
            pet_keeper_email: microchip?.email ?? null,
            microchip_id: microchip?.microchip_number ?? null,
            package_type: packageDetails?.package_name ?? null,
            total_amount: payment?.total_amount ?? 0,
          };
        })
      );

      return {
        message: "Microchip payment list retrieved successfully",
        data: result,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to retrieve Microchip", statusCode: 422 };
    }
  }

  @Get("/payment/invoice/:id")
  @Security("jwt")
  public async downloadInvoice(
    @Path() id: string,
    @Res() res: TsoaResponse<200 | 404 | 500, any>
  ) {
    try {
      const paymentRepo = AppDataSource.getRepository(MicrochipPayment);
      const paymentDetailsRepo = AppDataSource.getRepository(
        MicrochipPaymentDetails
      );
      const microchipRepo = AppDataSource.getRepository(Contact);
      const packageRepo = AppDataSource.getRepository(PackageDetails);

      // 1️⃣ Find main payment record
      const payment = await paymentRepo.findOne({
        where: { order_id: id },
      });

      if (!payment) {
        return res(404, { message: "Payment record not found" });
      }

      // 2️⃣ Get corresponding row from microchip_payment_details
      const details = await paymentDetailsRepo.findOne({
        where: {
          microchip_order_id: payment.id, // linking via payment table PK
        },
      });

      if (!details) {
        return res(404, { message: "Payment details not found" });
      }

      // 3️⃣ Now lookup microchip using microchip_id from DETAILS table
      const microchipDetails = await microchipRepo.findOne({
        where: { id: Number(details.microchip_id) },
      });

      if (!microchipDetails) {
        return res(404, { message: "Microchip record not found" });
      }

      // 4️⃣ Fetch package
      const packageDetails = await packageRepo.findOne({
        where: { id: Number(payment.package_id) },
      });

      // 5️⃣ Prepare PDF Data
      const pdfData = {
        orderId: payment.order_id,
        microchipNumber: microchipDetails.microchip_number ?? "N/A",
        petName: microchipDetails?.pet_name ?? "N/A",
        customerName: microchipDetails?.pet_keeper ?? "N/A",
        customerEmail: microchipDetails?.email ?? "N/A",
        customerPhone: microchipDetails?.phone_number ?? "N/A",
        customerAddress: microchipDetails?.address ?? "N/A",
        date: payment.date,
        amount: payment.total_amount,
        paymentType: payment.payment_type || "Not Provided",
        packageType: packageDetails?.package_name ?? "N/A",
        paymentStatus: payment.payment_status,
      };

      return {
        message: "Invoice data fetched successfully",
        data: pdfData,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return res(500, { message: "Error generating invoice" });
    }
  }

  @Security("jwt")
  @Post("/create")
  public async createMicrochip(
    @Request() request: MulterRequest
  ): Promise<{
    message: string;
    data?: Contact;
    statusCode: number;
    externalDatabase?: boolean;
  }> {
    return new Promise((resolve, reject) => {
      upload.single("photo")(request, {} as any, async (err: any) => {
        if (err) {
          console.error("Multer error:", err);
          return resolve({ message: "File upload failed", statusCode: 400 });
        }

        try {
          const microchipRepository = AppDataSource.getRepository(Contact);
          const assignMicrochipRepository =
            AppDataSource.getRepository(AssignedMicrochip);

          const actualToken = getTokenFromRequest(request);
          const decodedToken = decodeToken(actualToken);

          if (!decodedToken || typeof decodedToken !== "object") {
            return resolve({
              message: "Token not found or invalid",
              statusCode: 401,
            });
          }

          let is_claimed = "false";
          let status = "active";
          if (
            decodedToken.user_type != "Admin" &&
            decodedToken.user_type != "chipped_monkey_admin" &&
            decodedToken.user_type != "supervisor"
          ) {
            is_claimed = "true";
            status = "in_active";
          }
          const {
            microchipNumber,
            pet_keeper,
            phone_number,
            email,
            address,
            county,
            postcode,
            country,
            pet_name,
            pet_status,
            type,
            breed,
            sex,
            color,
            dob,
            markings,
          } = request.body;

          // Check if microchip number exists
          const existingMicrochip = await microchipRepository.findOne({
            where: { microchip_number: microchipNumber, status: "active" },
          });

          if (existingMicrochip) {
            return resolve({
              message: "Microchip number already exists",
              statusCode: 409,
            });
          }

          const externalCheck = await checkExternalMicrochip(microchipNumber);

          if (externalCheck.exists) {
            return resolve({
              message: externalCheck.message,
              externalDatabase: true,
              statusCode: 409,
            });
          }

          await assignMicrochipRepository.update(
            { microchip_number: microchipNumber }, // condition (match)
            { used_by: decodedToken.userId } // fields to update
          );

          const newMicrochip = microchipRepository.create({
            microchip_number: microchipNumber,
            pet_keeper,
            user_id: decodedToken.userId,
            phone_number,
            email,
            address,
            county,
            postcode,
            country,
            pet_name,
            pet_status,
            type,
            breed,
            sex,
            color,
            dob,
            markings,
            is_claimed: is_claimed,
            status: status,
            payment_status: "un_paid",
            photo: request.file ? "pet_images/" + request.file.filename : "",
          });

          const savedMicrochip = await microchipRepository.save(newMicrochip);

          return resolve({
            message: "Microchip created successfully",
            data: savedMicrochip,
            statusCode: 201,
          });
        } catch (error) {
          console.error(error);
          return resolve({
            message: "Failed to create microchip",
            statusCode: 422,
          });
        }
      });
    });
  }

  @Security("jwt")
  @Post("/dashboard/update/:actionType")
  public async updateDashboardMicrochip(
    @Request() request: any
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const { actionType } = request.params;
      const { microchip_number } = request.body;

      if (!microchip_number) {
        return { message: "Microchip number is required", statusCode: 400 };
      }

      const microchipRepository = AppDataSource.getRepository(Contact);

      // Find the microchip
      const microchip = await microchipRepository.findOne({
        where: { microchip_number },
      });

      if (!microchip) {
        return { message: "Microchip not found", statusCode: 404 };
      }

      switch (actionType.toLowerCase()) {
        case "unregister":
          microchip.status = "in_active"; // Deactivate the record
          break;

        case "unassign":
          microchip.user_id = 0; // Remove assigned user
          break;

        case "free":
          microchip.status = "active"; // Mark chip as reusable
          break;

        default:
          return { message: "Invalid action type", statusCode: 400 };
      }

      await microchipRepository.save(microchip);

      return {
        message: `${actionType} action completed successfully`,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error updating microchip:", error);
      return { message: "Failed to update microchip", statusCode: 500 };
    }
  }

  @Security("jwt")
  @Put("/update/:id")
  public async updateMicrochip(
    @Request() request: MulterRequest,
    @Path() id: number
  ): Promise<{ message: string; data?: Contact; statusCode: number; externalDatabase?:boolean }> {
    return new Promise((resolve) => {
      upload.single("photo")(request, {} as any, async (err: any) => {
        if (err) {
          console.error("Multer error:", err);
          return resolve({ message: "File upload failed", statusCode: 400 });
        }

        try {
          const microchipRepository = AppDataSource.getRepository(Contact);
          const assignMicrochipRepository =
            AppDataSource.getRepository(AssignedMicrochip);

          const actualToken = getTokenFromRequest(request);
          const decodedToken = decodeToken(actualToken);

          if (!decodedToken || typeof decodedToken !== "object") {
            return resolve({
              message: "Token not found or invalid",
              statusCode: 401,
            });
          }

          // Find the microchip to update
          const existingMicrochip = await microchipRepository.findOne({
            where: { id },
          });

          if (!existingMicrochip) {
            return resolve({ message: "Microchip not found", statusCode: 404 });
          }

          // Extract fields from request
          const {
            microchipNumber,
            pet_keeper,
            phone_number,
            email,
            address,
            county,
            postcode,
            country,
            pet_name,
            pet_status,
            type,
            breed,
            sex,
            color,
            dob,
            markings,
          } = request.body;

          // If microchip number changed, ensure it's unique
          if (
            microchipNumber &&
            microchipNumber !== existingMicrochip.microchip_number
          ) {
            const duplicate = await microchipRepository.findOne({
              where: { microchip_number: microchipNumber, status: "active" },
            });
            if (duplicate) {
              return resolve({
                message: "Microchip number already exists",
                statusCode: 409,
              });
            }
          }

                    const externalCheck = await checkExternalMicrochip(microchipNumber);

          if (externalCheck.exists) {
            return resolve({
              message: externalCheck.message,
              externalDatabase: true,
              statusCode: 409,
            });
          }


          // Update fields
          existingMicrochip.microchip_number =
            microchipNumber || existingMicrochip.microchip_number;
          existingMicrochip.pet_keeper =
            pet_keeper || existingMicrochip.pet_keeper;
          existingMicrochip.user_id = decodedToken.userId;
          existingMicrochip.phone_number =
            phone_number || existingMicrochip.phone_number;
          existingMicrochip.email = email || existingMicrochip.email;
          existingMicrochip.address = address || existingMicrochip.address;
          existingMicrochip.county = county || existingMicrochip.county;
          existingMicrochip.postcode = postcode || existingMicrochip.postcode;
          existingMicrochip.country = country || existingMicrochip.country;
          existingMicrochip.pet_name = pet_name || existingMicrochip.pet_name;
          existingMicrochip.pet_status =
            pet_status || existingMicrochip.pet_status;
          existingMicrochip.type = type || existingMicrochip.type;
          existingMicrochip.breed = breed || existingMicrochip.breed;
          existingMicrochip.sex = sex || existingMicrochip.sex;
          existingMicrochip.color = color || existingMicrochip.color;
          existingMicrochip.dob = dob || existingMicrochip.dob;
          existingMicrochip.markings = markings || existingMicrochip.markings;

          if (request.file) {
            existingMicrochip.photo = "pet_images/" + request.file.filename;
          }

          const updatedMicrochip = await microchipRepository.save(
            existingMicrochip
          );

          await assignMicrochipRepository.update(
            { microchip_number: microchipNumber }, // condition (match)
            { used_by: decodedToken.userId } // fields to update
          );
          return resolve({
            message: "Microchip updated successfully",
            data: updatedMicrochip,
            statusCode: 200,
          });
        } catch (error) {
          console.error(error);
          return resolve({
            message: "Failed to update microchip",
            statusCode: 422,
          });
        }
      });
    });
  }

  @Security("jwt")
  @Get("/edit/:id")
  public async getMicrochipForEdit(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; data?: Contact; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const microchipRepository = AppDataSource.getRepository(Contact);

      const microchip = await microchipRepository.findOne({
        where:
          decodedToken.user_type === "Admin" ||
          decodedToken.user_type == "supervisor" ||
          decodedToken.user_type === "chipped_monkey_admin"
            ? { id } // Admin can fetch any
            : { id, user_id: decodedToken.userId }, // Regular user can only fetch their own
      });

      if (!microchip) {
        return { message: "Microchip not found", statusCode: 404 };
      }

      return {
        message: "Microchip details fetched successfully",
        data: microchip,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch microchip details", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Delete("/delete/{id}")
  public async deleteMicrochip(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const microchipRepository = AppDataSource.getRepository(Contact);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (decodedToken && typeof decodedToken === "object") {
        const microchip = await microchipRepository.findOne({ where: { id } });

        if (!microchip) {
          return { message: "Microchip not found", statusCode: 404 };
        }

        await microchipRepository.remove(microchip);
      } else {
        return { message: "Token not found", statusCode: 404 };
      }

      return { message: "Microchip deleted successfully", statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { message: "Failed to delete Microchip", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/implanter/amount/:userId")
  public async getImplanterAmountByUser(
    @Path() userId: number
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const implanterAmountRepository =
        AppDataSource.getRepository(ImplantersAmount);

      const implanterAmount = await implanterAmountRepository.findOne({
        where: { user_id: Number(userId) },
      });

      if (!implanterAmount) {
        return {
          message: "No implanter amount found for this user",
          data: null,
          statusCode: 404,
        };
      }

      return {
        message: "Implanter amount fetched successfully",
        data: implanterAmount,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching implanter amount:", error);
      return {
        message: "Failed to fetch implanter amount",
        statusCode: 500,
      };
    }
  }

  @Security("jwt")
  @Post("/create/implanter/amount")
  public async createImplantersAmount(
    @Request() request: MulterRequest
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    return new Promise((resolve, reject) => {
      upload.single("photo")(request, {} as any, async (err: any) => {
        if (err) {
          console.error("Multer error:", err);
          return resolve({ message: "File upload failed", statusCode: 400 });
        }

        try {
          const implanterAmountRepository =
            AppDataSource.getRepository(ImplantersAmount);

          const actualToken = getTokenFromRequest(request);
          const decodedToken = decodeToken(actualToken);

          if (!decodedToken || typeof decodedToken !== "object") {
            return resolve({
              message: "Token not found or invalid",
              statusCode: 401,
            });
          }

          const { userId, value, paymentType } = request.body;

          // 🔍 1️⃣ Check if record already exists for this user
          const existingRecord = await implanterAmountRepository.findOne({
            where: { user_id: Number(userId) },
          });

          let savedImplanterAmount;

          if (existingRecord) {
            // 🔄 2️⃣ If exists → UPDATE
            existingRecord.value = Number(value);
            existingRecord.type = paymentType;

            savedImplanterAmount = await implanterAmountRepository.save(
              existingRecord
            );

            return resolve({
              message: "Implanter amount updated successfully",
              data: savedImplanterAmount,
              statusCode: 200,
            });
          }

          // 🆕 3️⃣ If not exists → CREATE NEW
          const newImplanterAmount = implanterAmountRepository.create({
            user_id: Number(userId),
            value: Number(value),
            type: paymentType,
          });

          savedImplanterAmount = await implanterAmountRepository.save(
            newImplanterAmount
          );

          return resolve({
            message: "Implanter amount created successfully",
            data: savedImplanterAmount,
            statusCode: 200,
          });
        } catch (error) {
          console.error(error);
          return resolve({
            message: "Failed to create or update implanter amount",
            statusCode: 422,
          });
        }
      });
    });
  }
}
