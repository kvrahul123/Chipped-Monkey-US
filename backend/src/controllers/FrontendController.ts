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
  Query,
} from "tsoa";
import crypto from "crypto";
import { format } from "date-fns";
import { AppDataSource } from "../../data-source";
import { getTokenFromRequest, decodeToken } from "../utilities/TokenUtility";
import { Contact } from "../../entities/Contact";
import multer from "multer";
import path from "path";
import express from "express";
import { initializeHelcimPayment } from "../../utils/initializeHelcimPayment";
import { Gender } from "../../entities/Gender";
import { User } from "../../entities/User";
import { Pages } from "../../entities/Pages";
import { Blogs } from "../../entities/Blogs";
import { In, IsNull, Like, MoreThan, ILike, Not } from "typeorm";
import { Uploads } from "../../entities/Uploads";
import { Product } from "../../entities/Products";
import { Order } from "../../entities/Order";
import { OrderProducts } from "../../entities/OrderProducts";
import { Enquiry } from "../../entities/Enquiry";
import { TransactionRequest } from "../../entities/TransactionRequest";
import { AssignedMicrochip } from "../../entities/AssignedMicrochip";
import { MicrochipOrders } from "../../entities/MicrochipOrders";
import twilio from "twilio";
import { WhatsappTemplate } from "../../entities/WhatsappTemplate";
import { WhatsappMessageLog } from "../../entities/WhatsappMessageLog";
import { OrderAddresses } from "../../entities/OrderAddresses";
import {
  decryptOpayoData,
  encryptOpayoData,
} from "../../utils/OpayaEncryptDecrypt";
import { PackageDetails } from "../../entities/PackageDetails";
import { MicrochipPayment } from "../../entities/MicrochipPayment";
import { MicrochipPaymentDetails } from "../../entities/MicrochipPaymentDetails";
import { TransactionDetails } from "../../entities/TransactionDetails";
import {
  externalSources,
  checkExternalMicrochip,
} from "../../utils/ExternalMicrochip";
import { initializeHelcimSubscription } from "../../utils/initializeHelcimSubscription";
import axios from "axios";

require("dotenv").config();
export interface OpayoTransactionResponse {
  nextUrl: string;
}

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

export interface ProductResponse extends Product {
  image_file_name: string | null;
  images?: string[];
}
interface CartItem {
  productId: number;
  quantity: number;
}

// ===== Extend Express Request for file typing =====
interface MulterRequest extends express.Request {
  file?: Express.Multer.File;
}

@Route("frontend")
export class FrontendController extends Controller {
  @Post("/microchip/create")
  public async createMicrochip(@Request() request: MulterRequest): Promise<{
    message: string;
    data?: Contact;
    statusCode: number;
    externalDatabase?: boolean;
  }> {
    return new Promise((resolve) => {
      // Handle single file upload
      upload.single("photo")(request, {} as any, async (err: any) => {
        if (err) {
          console.error("Multer error:", err);
          return resolve({ message: "File upload failed", statusCode: 400 });
        }
        let is_claimed = "false";
        try {
          const microchipRepository = AppDataSource.getRepository(Contact);
          const assignMicrochipRepository =
            AppDataSource.getRepository(AssignedMicrochip);

          // Decode token if available
          let userId = "";
          const actualToken = getTokenFromRequest(request);
          const decodedToken = decodeToken(actualToken);
          try {
            if (
              decodedToken &&
              typeof decodedToken === "object" &&
              decodedToken.userId
            ) {
              userId = decodedToken.userId;
              if (
                decodedToken.user_type != "Admin" &&
                decodedToken.user_type != "chipped_monkey_admin" &&
                decodedToken.user_type != "supervisor"
              ) {
                is_claimed = "true";
              }
            }
          } catch (e) {
            // Token not provided or invalid; userId remains ""
            return resolve({
              message: "Invalid token",
              statusCode: 401,
            });
          }

          let {
            microchip_number,
            pet_keeper,
            phone_number,
            email,
            address,
            address_line1,
            address_line2,
            company,
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

          // Check if microchip number already exists
          const existingMicrochip = await microchipRepository.findOne({
            where: { microchip_number: microchip_number },
          });

          if (
            (address_line1 != "" && address_line1 != undefined) ||
            (address_line2 != "" && address_line2 != undefined)
          ) {
            address = address_line1 + " " + address_line2;
          }
          if (existingMicrochip) {
            return resolve({
              message: "Microchip number already exists",
              statusCode: 409,
            });
          }
          const externalCheck = await checkExternalMicrochip(microchip_number);

          if (externalCheck.exists) {
            return resolve({
              message: externalCheck.message,
              externalDatabase: true,
              statusCode: 409,
            });
          }
          console.log("decodedToken.userId::" + decodedToken.userId);
          await assignMicrochipRepository.update(
            { microchip_number: microchip_number }, // condition (match)
            { used_by: decodedToken.userId } // fields to update
          );

          // Create new record
          const newMicrochip = microchipRepository.create({
            microchip_number: microchip_number,
            pet_keeper,
            user_id: Number(userId),
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
            company_name: company,
            is_claimed,
            payment_status: "un_paid",
            status: "in_active",
            photo: request.file ? `pet_images/${request.file.filename}` : "",
          });

          const savedMicrochip = await microchipRepository.save(newMicrochip);

          return resolve({
            message: "Microchip created successfully",
            data: savedMicrochip,
            statusCode: 200,
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

  @Post("/microchip/check")
  public async checkMicrochip(
    @Body() body: { microchip_number: string }
  ): Promise<{
    message: string;
    exists: boolean;
    data: object;
    statusCode: number;
    externalDatabase: boolean;
  }> {
    try {
      const microchipRepository = AppDataSource.getRepository(Contact);
      const { microchip_number } = body;

      if (!microchip_number) {
        return {
          message: "Microchip number is required",
          data: {},
          exists: false,
          externalDatabase: false,
          statusCode: 400,
        };
      }

      // 1️⃣ Check local database first
      const existingMicrochip = await microchipRepository.findOne({
        where: { microchip_number },
      });

      if (existingMicrochip) {
        return {
          message: `Microchip number already exists with Chipped Monkey`,
          exists: true,
          data: {
            microchipNumber: microchip_number,
            existingMicrochip: existingMicrochip,
            isRegistered: true,
            ownerLastUpdateDate: existingMicrochip.updated_at || null,
            isDistributed: false, // assume local DB does not track distribution
            registeredWith: "Chipped Monkey",
          },
          externalDatabase: false,
          statusCode: 200,
        };
      }

      // 2️⃣ Check external sources
      // const sources = externalSources(microchip_number);

      // const cleanParams = (params: Record<string, any>) => {
      //   const cleaned: Record<string, string> = {};
      //   for (const key in params) {
      //     const value = params[key];
      //     if (value !== undefined && value !== null) {
      //       cleaned[key] = String(value);
      //     }
      //   }
      //   return cleaned;
      // };

      // for (const source of sources) {
      //   try {
      //     const cleanedParams = cleanParams(source.params);
      //     const query = new URLSearchParams(cleanedParams);
      //     const response = await fetch(`${source.url}?${query.toString()}`);
      //     const text = await response.json(); // assume API returns JSON

      //     // If the microchip is registered or distributed
      //     if (text.isRegistered || text.isDistributed) {
      //       const msgParts: string[] = [];
      //       if (text.isRegistered)
      //         msgParts.push(`registered on ${source.name}`);
      //       if (text.isDistributed)
      //         msgParts.push(`distributed by ${source.name}`);

      //       return {
      //         message:
      //           `Microchip number is ${msgParts.join(" and ")}` +
      //           (source.phone_number
      //             ? `. Contact: ${source.phone_number}`
      //             : ""),
      //         exists: true,
      //         data: {
      //           microchipNumber: microchip_number,
      //           isRegistered: !!text.isRegistered,
      //           ownerLastUpdateDate: text.ownerLastUpdateDate || null,
      //           isDistributed: !!text.isDistributed,
      //           registeredWith: source.name,
      //         },
      //         externalDatabase: true,
      //         statusCode: 200,
      //       };
      //     }
      //   } catch (e) {
      //     console.error(`Error checking ${source.name}:`, e);
      //     continue;
      //   }
      // }

      // 3️⃣ Not found anywhere
      return {
        message: "This Microchip is not registered in any US database",
        exists: false,
        data: {
          microchipNumber: microchip_number,
          isRegistered: false,
          ownerLastUpdateDate: null,
          isDistributed: false,
          registeredWith: null,
        },
        externalDatabase: false,
        statusCode: 400,
      };
    } catch (error) {
      console.error("Microchip check error:", error);
      return {
        message: "Failed to check microchip",
        exists: false,
        data: {
          microchipNumber: "",
          isRegistered: false,
          ownerLastUpdateDate: null,
          isDistributed: false,
          registeredWith: null,
        },
        externalDatabase: false,
        statusCode: 500,
      };
    }
  }

  @Get("/gender/list")
  public async getGenders(): Promise<{
    message: string;
    data: Gender[];
    statusCode: number;
  }> {
    try {
      const genderRepository = AppDataSource.getRepository(Gender);

      const genders = await genderRepository.find();

      return {
        message: "Genders fetched successfully",
        data: genders,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching genders:", error);
      return {
        message: "Failed to fetch genders",
        data: [],
        statusCode: 500,
      };
    }
  }

  // Using tsoa decorator
  @Get("/implanters/list")
  public async getImplanters(
    @Query() postcode: string
  ): Promise<{ message: string; data: User[]; statusCode: number }> {
    try {
      if (!postcode) {
        return {
          message: "Postcode is required",
          data: [],
          statusCode: 400,
        };
      }

      const userRepository = AppDataSource.getRepository(User);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      const users = await userRepository.find({
        where: {
          postcode: Like(`%${postcode}%`),
        },
        select: [
          "company_name",
          "address_1",
          "address_2",
          "address_3",
          "company_address",
          "small_description",
          "country",
          "city",
          "postcode",
          "company_logo",
          "slug",
        ],
      });

      const implantersWithImages = await Promise.all(
        users.map(async (user) => {
          let file_name = null;

          if (user.company_logo) {
            // Ensure we take only the first ID if it's a comma-separated string
            const firstImageId = String(user.company_logo).split(",")[0].trim();

            const upload = await uploadsRepository.findOne({
              where: { id: Number(firstImageId) }, // convert to number if your DB ID is numeric
            });
            file_name = upload?.file_name || null;
          }

          return {
            ...user,
            imageUrl: file_name, // attach file name
          };
        })
      );

      return {
        message: "Implanters fetched successfully",
        data: implantersWithImages,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        message: "Failed to fetch users",
        data: [],
        statusCode: 500,
      };
    }
  }

  // Using tsoa decorator
  @Get("/pages/list")
  public async getPages(
    @Query() id?: number
  ): Promise<{ message: string; data: Pages[]; statusCode: number }> {
    try {
      if (!id) {
        return {
          message: "ID is required",
          data: [],
          statusCode: 400,
        };
      }

      const pagesRepository = AppDataSource.getRepository(Pages);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      const pages = await pagesRepository.find({
        where: { id: id },
      });

      const pagesWithImages = await Promise.all(
        pages.map(async (page) => {
          let file_name = null;

          if (page.meta_image) {
            // Ensure we take only the first ID if it's a comma-separated string
            const firstImageId = String(page.meta_image).split(",")[0].trim();

            const upload = await uploadsRepository.findOne({
              where: { id: Number(firstImageId) }, // convert to number if your DB ID is numeric
            });
            file_name = upload?.file_name || null;
          }

          return {
            ...page,
            image_file_name: file_name, // attach file name
          };
        })
      );

      return {
        message: "Pages fetched successfully",
        data: pagesWithImages,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      return {
        message: "Failed to fetch pages",
        data: [],
        statusCode: 500,
      };
    }
  }

  @Get("/blogs/list")
  public async getMicrochipLists(): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const blogsRepository = AppDataSource.getRepository(Blogs);
      const uploadsRepository = AppDataSource.getRepository(Uploads);
      const blogs = await blogsRepository.find({
        where: { deleted_at: IsNull() },
        order: { id: "DESC" },
      });

      if (!blogs.length) {
        return { message: "No blogs found", statusCode: 422 };
      }

      const blogsWithImages = await Promise.all(
        blogs.map(async (blog) => {
          let file_name = null;

          if (blog.image) {
            // Ensure we take only the first ID if it's a comma-separated string
            const firstImageId = String(blog.image).split(",")[0].trim();

            const upload = await uploadsRepository.findOne({
              where: { id: Number(firstImageId) }, // convert to number if your DB ID is numeric
            });
            file_name = upload?.file_name || null;
          }

          return {
            ...blog,
            image_file_name: file_name, // attach file name
          };
        })
      );

      return {
        message: "Blogs retrieved successfully",
        data: blogsWithImages,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve blogs", statusCode: 422 };
    }
  }

  @Get("/blogs/details")
  public async getMicrochipDetails(@Query("slug") slug?: string): Promise<{
    message: string;
    data?: any | any[];
    statusCode: number;
  }> {
    try {
      const blogsRepository = AppDataSource.getRepository(Blogs);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      // if slug is passed, fetch one blog, else fetch all
      if (slug) {
        const blog = await blogsRepository.findOne({
          where: { slug, deleted_at: IsNull() },
        });

        if (!blog) {
          return { message: "Blog not found", statusCode: 404 };
        }

        let file_name = null;
        if (blog.image) {
          const firstImageId = String(blog.image).split(",")[0].trim();
          const upload = await uploadsRepository.findOne({
            where: { id: Number(firstImageId) },
          });
          file_name = upload?.file_name || null;
        }

        return {
          message: "Blog retrieved successfully",
          data: {
            ...blog,
            image_file_name: file_name,
          },
          statusCode: 200,
        };
      } else {
        // otherwise return all blogs
        const blogs = await blogsRepository.find({
          where: { deleted_at: IsNull() },
          order: { id: "DESC" },
        });

        if (!blogs.length) {
          return { message: "No blogs found", statusCode: 422 };
        }

        const blogsWithImages = await Promise.all(
          blogs.map(async (blog) => {
            let file_name = null;

            if (blog.image) {
              const firstImageId = String(blog.image).split(",")[0].trim();
              const upload = await uploadsRepository.findOne({
                where: { id: Number(firstImageId) },
              });
              file_name = upload?.file_name || null;
            }

            return {
              ...blog,
              image_file_name: file_name,
            };
          })
        );

        return {
          message: "Blogs retrieved successfully",
          data: blogsWithImages,
          statusCode: 200,
        };
      }
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve blogs", statusCode: 422 };
    }
  }

  @Get("/implanter/details")
  public async getImplanterDetails(@Query("slug") slug?: string): Promise<{
    message: string;
    data?: any | any[];
    statusCode: number;
  }> {
    try {
      const usersRepository = AppDataSource.getRepository(User);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      // if slug is passed, fetch one blog, else fetch all
      if (slug) {
        const user = await usersRepository.findOne({
          where: { slug },
          select: [
            "address_1",
            "address_2",
            "address_3",
            "city",
            "company_address",
            "company_logo",
            "company_name",
            "country",
            "postcode",
            "small_description",
            "slug",
            "phone",
          ],
        });

        if (!user) {
          return { message: "User not found", statusCode: 404 };
        }

        let file_name = null;
        if (user.company_logo) {
          const firstImageId = String(user.company_logo).split(",")[0].trim();
          const upload = await uploadsRepository.findOne({
            where: { id: Number(firstImageId) },
          });
          file_name = upload?.file_name || null;
        }

        return {
          message: "User retrieved successfully",
          data: {
            ...user,
            image_file_name: file_name,
          },
          statusCode: 200,
        };
      } else {
        return { message: "Slug not found", data: [], statusCode: 404 };
      }
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve blogs", statusCode: 422 };
    }
  }

  @Post("/transfer/check-microchip")
  public async checkMicrochipNumber(
    @Body() body: { microchip_number: string }
  ): Promise<{
    message: string;
    data?: any;
    statusCode: number;
  }> {
    try {
      const contactsRepository = AppDataSource.getRepository(Contact);

      const contact = await contactsRepository.findOne({
        where: { microchip_number: body.microchip_number },
        select: ["id", "microchip_number", "otp", "is_claimed", "phone_number"],
      });

      if (!contact) {
        return { message: "Microchip number not found", statusCode: 404 };
      }

      if (contact.is_claimed == "true") {
        return { message: "Microchip already claimed", statusCode: 404 };
      }

      // ✅ Generate random 5-digit OTP
      const otp = Math.floor(10000 + Math.random() * 90000);
      contact.otp = otp.toString();
      await contactsRepository.save(contact);

      return {
        message: "Microchip number found",
        data: contact,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to check microchip number", statusCode: 422 };
    }
  }

  @Post("/transfer/verify-otp")
  public async verifyOtp(
    @Request() request: any,
    @Body() body: { microchip_number: string; data?: any; otp: string }
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      let userId;
      if (
        decodedToken &&
        typeof decodedToken === "object" &&
        decodedToken.userId
      ) {
        userId = decodedToken.userId;
      }
      // if (!userId) {
      //   return { message: "Invalid token", statusCode: 401 };
      // }

      const contactsRepository = AppDataSource.getRepository(Contact);

      const contact = await contactsRepository.findOne({
        where: { microchip_number: body.microchip_number },
        select: ["id", "microchip_number", "otp", "is_claimed", "phone_number"],
      });

      if (!contact) {
        return { message: "Microchip not found", statusCode: 404 };
      }

      if (contact.is_claimed == "true") {
        return { message: "OTP already claimed", statusCode: 400 };
      }

      if (contact.otp !== body.otp) {
        return { message: "Invalid OTP", statusCode: 401 };
      }

      // ✅ Mark as claimed
      contact.is_claimed = "true";
      contact.user_id = userId ? Number(userId) : 0;
      await contactsRepository.save(contact);

      return {
        message: "OTP verified successfully",
        data: contact,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to verify OTP", statusCode: 422 };
    }
  }

  @Get("/products/list")
  public async getProducts(): Promise<{
    message: string;
    data: Product[];
    statusCode: number;
  }> {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const uploadRepository = AppDataSource.getRepository(Uploads);
      const products = await productRepository.find({
        where: { status: "active", deleted_at: IsNull() },
      });
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          let file_name = null;

          if (product.image) {
            // Ensure we take only the first ID if it's a comma-separated string
            const firstImageId = String(product.image).split(",")[0].trim();

            const upload = await uploadRepository.findOne({
              where: { id: Number(firstImageId) }, // convert to number if your DB ID is numeric
            });
            file_name = upload?.file_name || null;
          }

          return {
            ...product,
            image_file_name: file_name, // attach file name
          };
        })
      );
      return {
        message: "Products fetched successfully",
        data: productsWithImages,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        message: "Failed to fetch products",
        data: [],
        statusCode: 500,
      };
    }
  }

  @Get("/products/list/{slug}")
  public async getProductBySlug(@Path() slug: string): Promise<{
    message: string;
    data: ProductResponse | null;
    statusCode: number;
  }> {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const uploadRepository = AppDataSource.getRepository(Uploads);

      const product = await productRepository.findOne({
        where: { slug, status: "active", deleted_at: IsNull() },
      });

      if (!product) {
        return {
          message: "Product not found",
          data: null,
          statusCode: 404,
        };
      }

      let imageFiles: string[] = [];
      if (product.image) {
        const imageIds = String(product.image)
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id);

        const uploads = await uploadRepository.findByIds(
          imageIds.map((id) => Number(id))
        );

        imageFiles = uploads
          .map((u) => u.file_name ?? "")
          .filter((name): name is string => name !== "");
      }

      return {
        message: "Product fetched successfully",
        data: {
          ...product,
          images: imageFiles,
          image_file_name: imageFiles.length > 0 ? imageFiles[0] : null,
        }, // 👈 ensure image_file_name is present
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      return {
        message: "Failed to fetch product",
        data: null,
        statusCode: 500,
      };
    }
  }

  @Post("/cart/details")
  public async getCartDetails(@Body() body: CartItem[]): Promise<{
    message: string;
    data?: any;
    totalAmount?: number;
    statusCode: number;
  }> {
    try {
      if (!Array.isArray(body) || body.length === 0) {
        return { message: "Cart is empty", statusCode: 400 };
      }

      const productRepo = AppDataSource.getRepository(Product);

      // extract product IDs from body
      const productIds = body.map((item) => item.productId);

      // fetch products
      const products = await productRepo.find({
        where: { id: In(productIds) },
        select: ["id", "title", "price"],
      });

      // merge details
      const detailedCart = body
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;

          return {
            productId: product.id,
            name: product.title,
            price: product.price,
            quantity: item.quantity,
            total: product.price ? product.price * item.quantity : 0,
          };
        })
        .filter(Boolean);

      const totalAmount = detailedCart.reduce(
        (sum, item: any) => sum + item.total,
        0
      );

      return {
        message: "Cart details fetched successfully",
        data: detailedCart,
        totalAmount,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Failed to fetch cart details",
        statusCode: 500,
      };
    }
  }

  @Get("/order/addresses")
  public async getUserAddresses(
    @Request() request: any
  ): Promise<{ message: string; data?: any[]; statusCode: number }> {
    try {
      // 1️⃣ Decode token to get userId
      let userId = "";
      try {
        const actualToken = getTokenFromRequest(request);
        const decodedToken = decodeToken(actualToken);
        if (
          decodedToken &&
          typeof decodedToken === "object" &&
          decodedToken.userId
        ) {
          userId = decodedToken.userId;
        } else {
          return { message: "Invalid token", statusCode: 401 };
        }
      } catch {
        return { message: "Token missing or invalid", statusCode: 401 };
      }

      // 2️⃣ Fetch addresses from DB
      const orderAddressRepository =
        AppDataSource.getRepository(OrderAddresses);
      const addresses = await orderAddressRepository.find({
        where: { user_id: Number(userId) },
        order: { id: "DESC" }, // newest first
      });

      // 3️⃣ Return response
      if (!addresses.length) {
        return { message: "No addresses found", data: [], statusCode: 200 };
      }

      return {
        message: "Addresses fetched successfully",
        data: addresses,
        statusCode: 200,
      };
    } catch (err) {
      console.error("❌ Error fetching addresses:", err);
      return { message: "Failed to fetch addresses", statusCode: 500 };
    }
  }

  @Post("/order/save")
  public async saveOrder(
    @Request() request: any,
    @Body()
    body: {
      name: string;
      email: string;
      phone_number: string;
      address: string;
      county: string;
      city: string;
      country: string;
      pincode: string;
      discount_amount?: number;
      default_address?: boolean;
      cart: {
        productId: number;
        quantity: number;
        slug?: string;
        product_price?: number;
      }[];
    }
  ): Promise<any> {
    try {
      // 1️⃣ Decode token
      let userId = "";
      try {
        const actualToken = getTokenFromRequest(request);
        const decodedToken = decodeToken(actualToken);
        if (
          decodedToken &&
          typeof decodedToken === "object" &&
          decodedToken.userId
        ) {
          userId = decodedToken.userId;
        } else {
          return { message: "Invalid token", statusCode: 401 };
        }
      } catch {
        return { message: "Token missing or invalid", statusCode: 401 };
      }

      // 2️⃣ Save Order inside DB transaction and return both orderId and totalAmount
      const txResult = await AppDataSource.manager.transaction<{
        orderId: string;
        totalAmount: number;
        vendorTxCode: string;
      }>(async (manager) => {
        const orderRepo = manager.getRepository(Order);
        const orderProductRepo = manager.getRepository(OrderProducts);
        const productRepo = manager.getRepository(Product);
        const addressRepo = manager.getRepository(OrderAddresses);

        let totalAmount = 0;
        const orderProducts: OrderProducts[] = [];

        // calculate totals and prepare products
        for (const item of body.cart) {
          const product = await productRepo.findOne({
            where: { id: item.productId },
            select: ["price", "title"],
          });

          if (!product)
            throw new Error(`Product with ID ${item.productId} not found`);

          const productTotal = (product.price || 0) * item.quantity;
          totalAmount += productTotal;

          orderProducts.push(
            orderProductRepo.create({
              product_name: product.title,
              product_qty: String(item.quantity),
              product_price: String(product.price),
              status: "active",
            })
          );
        }

        const orderID = `ORD-${Date.now()}`;

        const order = orderRepo.create({
          order_id: orderID,
          user_id: userId,
          name: body.name,
          email: body.email,
          date: format(new Date(), "dd/MM/yyyy"),
          phone_number: Number(body.phone_number),
          address: body.address,
          county: body.county,
          city: body.city,
          country: body.country,
          pincode: body.pincode,
          total_amount: Number(totalAmount) || 0,
          discount_amount: body.discount_amount || 0,
          payment_status: "un_paid",
          status: "active",
        });

        const savedOrder = await orderRepo.save(order);

        // attach order id to product rows and save
        for (const op of orderProducts) op.order_id = String(savedOrder.id);
        await orderProductRepo.save(orderProducts);

        // save/update default address if requested
        if (body.default_address) {
          const existingAddress = await addressRepo.findOne({
            where: { user_id: Number(userId) },
          });

          if (existingAddress) {
            existingAddress.name = body.name;
            existingAddress.email = body.email;
            existingAddress.phone_number = body.phone_number;
            existingAddress.address = body.address;
            existingAddress.county = body.county;
            existingAddress.city = body.city;
            existingAddress.country = body.country;
            existingAddress.pincode = body.pincode;

            await addressRepo.save(existingAddress);
          } else {
            const newAddress = addressRepo.create({
              user_id: Number(userId),
              name: body.name,
              email: body.email,
              phone_number: body.phone_number,
              address: body.address,
              county: body.county,
              city: body.city,
              country: body.country,
              pincode: body.pincode,
            });

            await addressRepo.save(newAddress);
          }
        }
        // 🔥 Generate vendorTxCode and save inside order
        const vendorTxCode = `TXN_${savedOrder.order_id}_${Date.now()}`;
        savedOrder.vendorTxCode = vendorTxCode;
        await orderRepo.save(savedOrder);
        return {
          orderId: String(savedOrder.order_id),
          totalAmount,
          vendorTxCode,
        };
      });

      // 3️⃣ Transaction succeeded — prepare Opayo payment data using txResult
      const orderId = txResult.orderId;
      const totalAmount = txResult.totalAmount;

      // 4️⃣ Build data string WITHOUT URL-encoding the Success/Failure (Opayo expects raw)

      const checkoutToken = await initializeHelcimPayment({
        amount: Number(totalAmount),
        currency: "USD",
        description: `Product Purchase - Order ID: ${orderId}`,
        returnUrl: process.env.HELCIM_RETURN_URL || "",
        cancelUrl: process.env.HELCIM_CANCEL_URL || "",
      });

      // 7️⃣ Return nextUrl + formFields so frontend can auto-submit the form
      return {
        statusCode: 200,
        message: "Order placed successfully",
        orderId,
        checkoutToken,
      };
    } catch (error) {
      console.error("❌ Error saving order:", error);
      return { message: "Failed to save order", statusCode: 500 };
    }
  }

  @Post("/microchip/payment")
  public async microchipPayment(
    @Request() request: any,
    @Body() body: { microchip_id: number; selected_plan: string }
  ): Promise<any> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Auth
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (!decodedToken?.userId) {
        return { statusCode: 401, message: "Invalid token" };
      }

      const userId = decodedToken.userId;

      // 2️⃣ Repositories
      const microchipRepo = queryRunner.manager.getRepository(Contact);
      const packageRepo = queryRunner.manager.getRepository(PackageDetails);
      const paymentRepo = queryRunner.manager.getRepository(MicrochipPayment);

      // 3️⃣ Validate Microchip
      const microchip = await microchipRepo.findOne({
        where: {
          microchip_number: String(body.microchip_id),
          user_id: Number(userId),
        },
      });

      if (!microchip) {
        return { statusCode: 404, message: "Microchip not found" };
      }

      // 4️⃣ Package
      const packageData = await packageRepo.findOne({
        where: { package_name: ILike(body.selected_plan) },
      });

      if (!packageData) {
        return { statusCode: 404, message: "Package not found" };
      }

      // 6️⃣ Save pending payment
      const randomOrderId = `MC-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      const amount = packageData.price;

      const paymentEntry = paymentRepo.create({
        order_id: randomOrderId,
        user_id: Number(userId),
        payment_type: "purchase",
        payment_response: null,
        payment_encrypted_response: null,
        date: new Date().toISOString().slice(0, 10),
        total_amount: Number(amount),
        package_id: packageData.id,
        payment_status: "un_paid",
        status: "active",
      });

      await paymentRepo.save(paymentEntry);
      const detailsRepo = queryRunner.manager.getRepository(
        MicrochipPaymentDetails
      );

      const detailsEntry = detailsRepo.create({
        microchip_order_id: paymentEntry.id, // link to main table
        microchip_id: String(microchip.id), // old microchip id stored here
        amount:Number(amount),
        status: "un_paid",
      });
      await detailsRepo.save(detailsEntry);
      await queryRunner.commitTransaction();

      const checkoutToken = await initializeHelcimPayment({
        amount: Number(packageData.price),
        currency: "USD",
        description: `Microchip Payment #${microchip.microchip_number}`,
        returnUrl: process.env.HELCIM_RETURN_URL || "",
        cancelUrl: process.env.HELCIM_CANCEL_URL || "",
      });

      return {
        statusCode: 200,
        checkoutToken,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      return { statusCode: 500, message: "Payment failed" };
    } finally {
      await queryRunner.release();
    }
  }

  @Post("/microchip/subscription")
  public async microchipSubscription(
    @Request() request: any,
    @Body() body: { microchip_id: number; plan: "annual" }
  ): Promise<any> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Helper function for early rollback
    const rollbackAndReturn = async (payload: any) => {
      try {
        await queryRunner.rollbackTransaction();
      } catch (e) {
        console.error("Rollback failed:", e);
      }
      return payload;
    };

    try {
      // 1️⃣ Auth
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);
      if (!decodedToken?.userId) {
        return await rollbackAndReturn({
          statusCode: 401,
          message: "Invalid token",
        });
      }
      const userId = decodedToken.userId;

      // 2️⃣ Repositories
      const microchipRepo = queryRunner.manager.getRepository(Contact);
      const packageRepo = queryRunner.manager.getRepository(PackageDetails);
      const paymentRepo = queryRunner.manager.getRepository(MicrochipPayment);

      // 3️⃣ Validate Microchip
      const microchip = await microchipRepo.findOne({
        where: {
          microchip_number: String(body.microchip_id),
          user_id: Number(userId),
        },
      });
      if (!microchip) {
        return await rollbackAndReturn({
          statusCode: 404,
          message: "Microchip not found",
        });
      }

      // 4️⃣ Validate Package (annual)
      const packageData = await packageRepo.findOne({
        where: { package_name: ILike("annual") },
      });
      if (!packageData) {
        return await rollbackAndReturn({
          statusCode: 404,
          message: "Package not found",
        });
      }

      // 5️⃣ Create pending subscription payment
      const orderId = `SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const paymentEntry = paymentRepo.create({
        order_id: orderId,
        user_id: Number(userId),
        payment_type: "subscription",
        payment_status: "pending",
        total_amount: Number(packageData.price),
        package_id: packageData.id,
        status: "active",
      });

      await paymentRepo.save(paymentEntry);

      // ✅ Commit transaction only after all DB operations succeed
      await queryRunner.commitTransaction();

      // 6️⃣ HELCIM – CREATE SUBSCRIPTION CHECKOUT
const checkoutToken = await initializeHelcimSubscription({
  dateActivated: "2025-12-23",
  paymentPlanId: 12345,
  customerCode: "CUST-001",
  recurringAmount: 19.99,
  paymentMethod: "card",
  useCustomSetupAmount: false, // optional
});
console.log(checkoutToken);


      return {
        statusCode: 200,
        checkoutToken,
      };
    } catch (err) {
      console.error("Subscription error:", err);
      try {
        await queryRunner.rollbackTransaction();
      } catch (e) {
        console.error("Rollback failed:", e);
      }
      return { statusCode: 500, message: "Subscription setup failed" };
    } finally {
      await queryRunner.release();
    }
  }

  @Post("/transaction/request")
  public async createTransferRequest(
    @Request() request: any,
    @Body()
    body: {
      sort_code: string;
      requested_amount: string;
      account_number: string;
      account_number_confirmation: string;
      bank_name: string;
      account_holders_name: string;
    }
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      // Confirm account numbers match
      if (body.account_number !== body.account_number_confirmation) {
        return { message: "Account numbers do not match", statusCode: 400 };
      }

      const transferRepo = AppDataSource.getRepository(TransactionRequest);
      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);

      let checkAssignedMicrochip = await assignedMicrochipRepository.findOne({
        where: {
          assigned_to: Number(decodedToken.userId),
          transfer_request_id: IsNull(),
        },
      });
      if (!checkAssignedMicrochip) {
        return {
          message: "Please assign microchip before requesting transfer",
          statusCode: 400,
        };
      }
      const newRequest = transferRepo.create({
        transaction_id: `TXN-${Date.now()}`,
        sort_code: body.sort_code,
        requested_amount: body.requested_amount,
        account_number: body.account_number,
        bank_name: body.bank_name,
        account_holders_name: body.account_holders_name,
        user_id: Number(decodedToken.userId),
        status: "un_paid",
      });

      const savedRequest = await transferRepo.save(newRequest);

      await assignedMicrochipRepository.update(
        {
          assigned_to: Number(decodedToken.userId),
          transfer_request_id: IsNull(),
        },
        {
          transfer_request_id: savedRequest.id,
        }
      );

      return {
        message: "Transfer request created successfully",
        data: savedRequest,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to create transfer request", statusCode: 422 };
    }
  }

  @Post("/transaction/list")
  public async getTransferRequest(
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const transferRepo = AppDataSource.getRepository(TransactionRequest);
      const transactionDetailsRepo =
        AppDataSource.getRepository(TransactionDetails);

      const transaction = await transferRepo.find({
        where: { user_id: Number(decodedToken.userId) },
        order: { id: "DESC" },
      });
      const transactionDetails = await Promise.all(
        transaction.map(async (txn) => {
          const details = await transactionDetailsRepo.find({
            where: { transactionRequest_id: Number(txn.id) },
          });
          const totalAmount = details.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
          );
          return {
            ...txn,
            paid_amount: totalAmount,
          };
        })
      );

      return {
        message: "Transfer get successfully",
        data: transactionDetails,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to create transfer request", statusCode: 422 };
    }
  }

  @Post("/registered_microchip/list")
  public async getRegisteredMicrochip(
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const microchipOrdersRepository =
        AppDataSource.getRepository(MicrochipOrders);
      const assignedMicrochipRepository =
        AppDataSource.getRepository(AssignedMicrochip);

      const microchipOrder = await microchipOrdersRepository.find({
        where: { user_id: Number(decodedToken.userId) },
        order: { id: "DESC" },
      });
      const assignedMicrochip = await assignedMicrochipRepository.find({
        where: { assigned_to: Number(decodedToken.userId) },
        order: { id: "DESC" },
      });
      // 🔹 Map assignedMicrochip with related order

      const assignedWithOrders = microchipOrder.map((order) => {
        const relatedAssigned = assignedMicrochip.filter(
          (assigned) => Number(assigned.order_id) == order.id
        );
        return {
          ...order,
          assigned: relatedAssigned.length ? relatedAssigned : null, // ✅ all rows
          microchip_ids: relatedAssigned.length
            ? relatedAssigned.map((a) => a.microchip_number).join(",")
            : null,
        };
      });

      return {
        message: "Registered Microchip get successfully",
        data: assignedWithOrders,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to create transfer request", statusCode: 422 };
    }
  }

  @Post("/wallet/amount")
  public async getWalletAmount(
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const transactionRepository =
        AppDataSource.getRepository(TransactionRequest);
      const transactionDetailsRepository =
        AppDataSource.getRepository(TransactionDetails);

      // 1️⃣ Get all completed transactions for this user
      const transactions = await transactionRepository.find({
        where: { user_id: decodedToken.userId, status: "completed" },
      });

      if (transactions.length === 0) {
        return {
          message: "Wallet amount fetched successfully",
          data: { totalAmount: 0 },
          statusCode: 200,
        };
      }

      // 👉 Extract all transaction IDs from array
      const transactionIds = transactions.map((t) => t.id);

      // 2️⃣ Fetch details for ALL transaction IDs
      const transactionDetails = await transactionDetailsRepository.find({
        where: {
          transactionRequest_id: In(transactionIds),
          status: "completed",
        },
      });

      // 3️⃣ Calculate total amount (from TransactionRequest table)
      const totalAmount = transactionDetails.reduce(
        (sum, txn) => sum + Number(txn.amount || 0),
        0
      );

      return {
        message: "Wallet amount fetched successfully",
        data: { totalAmount, transactionDetails },
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
      return {
        message: "Failed to fetch wallet amount",
        data: [],
        statusCode: 500,
      };
    }
  }

  @Post("/twilio/fetchMicrochip")
  public async fetchTwilioMicrochip(@Request() request: any): Promise<any> {
    try {
      // Repository
      const whatsappTemplateRepository =
        AppDataSource.getRepository(WhatsappTemplate);
      const contactRepository = AppDataSource.getRepository(Contact);
      const messageLogRepository =
        AppDataSource.getRepository(WhatsappMessageLog);

      // Twilio client init (cached globally)
      const twilioLib = require("twilio");
      const globalAny: any = global as any;
      if (!globalAny.__twilioClient) {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
          console.error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN missing");
          request.res.statusCode = 500;
          return request.res.end("Server config error");
        }
        globalAny.__twilioClient = twilioLib(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
      }
      const client = globalAny.__twilioClient;

      // Parse body
      const rawBody = request.body;
      const cleanBody: any = {};
      for (const key in rawBody) {
        const cleanKey = key.replace(/^"|"$/g, "").trim();
        let value = rawBody[key]?.toString() || "";
        value = value.replace(/^"|"$/g, "").replace(/,$/, "").trim();
        cleanBody[cleanKey] = value;
      }

      const incomingMsg = (cleanBody.Body || cleanBody.body || "")
        .toLowerCase()
        .trim();
      const fromNumber = cleanBody.From || cleanBody.from || "";

      const greetings = [
        "hi",
        "hello",
        "welcome",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
      ];

      const savedLog = await messageLogRepository.save({
        from_number: fromNumber,
        message_body: incomingMsg,
        msg_type: "success",
      });

      // Fetch dynamic template messages
      const greetingTemplate = await whatsappTemplateRepository.findOne({
        where: { msg_type: "greeting", status: "active" },
      });
      const microchipTemplate = await whatsappTemplateRepository.findOne({
        where: { msg_type: "microchip_number", status: "active" },
      });
      const microchipmaxTriesTemplate =
        await whatsappTemplateRepository.findOne({
          where: { msg_type: "maxtries_msg", status: "active" },
        });
      const microchipCountErrTemplate =
        await whatsappTemplateRepository.findOne({
          where: { msg_type: "microchip_count_err", status: "active" },
        });
      const microchipSuccessTemplate = await whatsappTemplateRepository.findOne(
        {
          where: { msg_type: "microchip_success", status: "active" },
        }
      );
      const microchipExternalSuccess = await whatsappTemplateRepository.findOne(
        {
          where: { msg_type: "external_microchip_found", status: "active" },
        }
      );

      if (greetings.some((word) => incomingMsg.startsWith(word))) {
        // Send greeting message
        if (greetingTemplate && microchipTemplate) {
          const combinedMessage = `${greetingTemplate.message}\n${microchipTemplate.message}`;

          await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: fromNumber,
            body: combinedMessage,
          });

          if (savedLog?.id) {
            await messageLogRepository.update(savedLog.id, {
              response_body: combinedMessage,
              msg_type: "success",
            });
          }
        }
      } else if (incomingMsg) {
        if (incomingMsg == "found pets" || incomingMsg == "lost pets") {
          let successMsg;
          if (incomingMsg == "found pets") {
            const microchipBtnTemplate =
              await whatsappTemplateRepository.findOne({
                where: { msg_type: "found_pets_btn_msg", status: "active" },
              });
            successMsg = `${microchipBtnTemplate?.message}`;
          } else {
            const microchipBtnTemplate =
              await whatsappTemplateRepository.findOne({
                where: { msg_type: "lost_pets_btn_msg", status: "active" },
              });
            successMsg = `${microchipBtnTemplate?.message}`;
          }
          await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: fromNumber,
            body: successMsg,
          });
          if (savedLog?.id) {
            await messageLogRepository.update(savedLog.id, {
              response_body: successMsg,
              msg_type: "success",
            });
          }
        } else {
          // Check if message contains only digits and between 10–16 chars
          const onlyDigits = incomingMsg.replace(/\D/g, "");
          if (onlyDigits.length >= 10 && onlyDigits.length <= 16) {
            const contact = await contactRepository.findOne({
              where: { microchip_number: onlyDigits },
            });

            if (contact) {
              // ✅ Found in Chipped Monkey DB
              const successMsg = `${microchipSuccessTemplate?.message} Chipped Monkey`;
              await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: fromNumber,
                body: successMsg,
              });
              if (savedLog?.id) {
                await messageLogRepository.update(savedLog.id, {
                  response_body: successMsg,
                  msg_type: "success",
                });
              }
              await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: fromNumber,
                contentSid: "HX118cf232fcf48fe7cd4f2ec675d74caf", // Pre-approved WhatsApp template in Twilio
                contentVariables: JSON.stringify({
                  1: "Lost Pets", // variable values inside template
                  2: "Found Pets",
                }),
              });
            } else {
              const sources = externalSources(onlyDigits);
              let foundSource: any = null;

              const cleanParams = (params: Record<string, any>) => {
                const cleaned: Record<string, string> = {};
                for (const key in params) {
                  if (params[key] !== undefined && params[key] !== null) {
                    cleaned[key] = String(params[key]);
                  }
                }
                return cleaned;
              };

              for (const source of sources) {
                try {
                  const cleanedParams = cleanParams(source.params);
                  const query = new URLSearchParams(cleanedParams);

                  const response = await fetch(
                    `${source.url}?${query.toString()}`
                  );
                  const text = (await response.text()).trim().toLowerCase();

                  if (text === "true") {
                    foundSource = source;
                    break;
                  }
                } catch (err) {
                  console.error(`Error checking source ${source.name}:`, err);
                }
              }

              if (foundSource) {
                let successMsg = microchipExternalSuccess?.message || "";

                // Replace placeholders dynamically
                successMsg = successMsg.replace(
                  "{name}",
                  foundSource.name || ""
                );
                successMsg = successMsg.replace(
                  "{phone}",
                  foundSource.phone_number || "N/A"
                );
                successMsg = successMsg.replace(
                  "{website}",
                  foundSource.website || "N/A"
                );

                await client.messages.create({
                  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                  to: fromNumber,
                  body: successMsg,
                });

                if (savedLog?.id) {
                  await messageLogRepository.update(savedLog.id, {
                    response_body: successMsg,
                    msg_type: "success",
                  });
                }
              } else {
                const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
                let recentErrors = await messageLogRepository.count({
                  where: {
                    from_number: fromNumber,
                    msg_type: "error",
                    created_at: MoreThan(threeHoursAgo),
                  },
                });
                recentErrors = Number(recentErrors) + 1;
                let replyMessage = "";
                console.log("recentErrors::" + recentErrors);
                if (recentErrors > 3) {
                  replyMessage =
                    microchipmaxTriesTemplate?.message ||
                    "Too many attempts. Please try again later.";
                } else {
                  replyMessage = `Microchip number ${onlyDigits} not found. Please try again.`;
                }

                await client.messages.create({
                  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                  to: fromNumber,
                  body: replyMessage,
                });
                if (savedLog?.id) {
                  await messageLogRepository.update(savedLog.id, {
                    response_body: replyMessage,
                    msg_type: "error",
                  });
                }
              }
            }
          } else {
            // ⚠️ Invalid number length
            const errMsg = microchipCountErrTemplate?.message;
            await client.messages.create({
              from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
              to: fromNumber,
              body: errMsg,
            });
            if (savedLog?.id) {
              await messageLogRepository.update(savedLog.id, {
                response_body: errMsg,
                msg_type: "warning",
              });
            }
          }
        }
      } else {
        await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: fromNumber,
          body: "Sorry, I didn't receive any text",
        });

        if (savedLog?.id) {
          await messageLogRepository.update(savedLog.id, {
            response_body: "Sorry, I didn't receive any text",
            msg_type: "error",
          });
        }
      }

      // Always return 200 with empty TwiML so Twilio knows webhook succeeded
      request.res.setHeader("Content-Type", "text/xml");
      request.res.statusCode = 200;
      request.res.end("<Response></Response>");
    } catch (error) {
      console.error("Error handling Twilio message:", error);
      try {
        request.res.statusCode = 500;
        request.res.end("Failed to process message");
      } catch (e) {
        /* ignore */
      }
    }
  }

  
@Post("/lost_found/list")
public async getLostFoundPets(
  @Request() request: any
): Promise<{ message: string; data?: any; statusCode: number }> {
  try {
    const microchipRepository = AppDataSource.getRepository(Contact);

    const result = await microchipRepository.find({
      where: {
        status: "active",
      },
      order: {
        created_at: "DESC",
      },
    });

    return {
      message: "Lost & Found pets fetched successfully",
      data: result,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch lost & found pets",
      statusCode: 422,
    };
  }
}
@Get("/lost_found/details/{id}")
public async getLostFoundPetById(
  @Path() id: number
): Promise<{ message: string; data?: any; statusCode: number }> {
  try {
    const contactRepository = AppDataSource.getRepository(Contact);

    const result = await contactRepository.findOne({
      where: {
        id: id,
        status: "active",
      },
    });

    if (!result) {
      return {
        message: "Pet not found",
        statusCode: 404,
      };
    }

    return {
      message: "Lost & Found pet fetched successfully",
      data: result,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch pet details",
      statusCode: 422,
    };
  }
}

}
