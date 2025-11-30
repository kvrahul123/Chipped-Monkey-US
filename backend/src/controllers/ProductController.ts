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
} from "tsoa";
import { IsNull, DeepPartial } from "typeorm";
import { AppDataSource } from "../../data-source";
import { getTokenFromRequest, decodeToken } from "../utilities/TokenUtility";
import { Contact } from "../../entities/Contact";
import { Uploads } from "../../entities/Uploads";
import { Product } from "../../entities/Products";
import { Order } from "../../entities/Order";
import { OrderProducts } from "../../entities/OrderProducts";

export interface CreateProductRequest {
  title: string;
  slug?: string;
  image?: string;
  price?: number;
  specifications?: string;
  description?: string;
  meta_title: string;
  meta_img?: string;
  meta_description?: string;
  meta_keywords?: string;
}

@Route("products")
export class ProductController extends Controller {
  @Get("/lists")
  public async getProductLists(): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const productsRepository = AppDataSource.getRepository(Product);
      const uploadsRepository = AppDataSource.getRepository(Uploads);
      const product = await productsRepository.find({
        where: { deleted_at: IsNull() },
        order: { id: "DESC" },
      });

      if (!product.length) {
        return { message: "No products found", statusCode: 422 };
      }

      const blogsWithImages = await Promise.all(
        product.map(async (p) => {
          let file_name = null;

          if (p.image) {
            // Ensure we take only the first ID if it's a comma-separated string
            const firstImageId = String(p.image).split(",")[0].trim();

            const upload = await uploadsRepository.findOne({
              where: { id: Number(firstImageId) }, // convert to number if your DB ID is numeric
            });
            file_name = upload?.file_name || null;
          }

          return {
            ...p,
            image_file_name: file_name, // attach file name
          };
        })
      );

      return {
        message: "Products retrieved successfully",
        data: blogsWithImages,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve product", statusCode: 422 };
    }
  }

  @Get("/orders/lists")
  public async getOrderProductLists(@Request() request: Request): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken) return { message: "Token invalid", statusCode: 401 };
      let orders: any[] = [];

      if (
        decodedToken.user_type === "Admin" ||
        decodedToken.user_type === "chipped_monkey_admin" 
        ||
        decodedToken.user_type === "supervisor"
      ) {

        orders = await orderRepository.find({
          where: { deleted_at: IsNull() },
          order: { id: "DESC" },
        });
      } else {
        orders = await orderRepository.find({
          where: {
            deleted_at: IsNull(),
            user_id: decodedToken.userId,
          },
          order: { id: "DESC" },
        });
      }

      if (!orders.length) {
        return { message: "No orders found", statusCode: 422 };
      }

      const Aorders = await Promise.all(
        orders.map(async (p) => {
          return {
            ...p,
          };
        })
      );

      return {
        message: "Orders retrieved successfully",
        data: Aorders,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve orders", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Post("/create")
  public async createProducts(
    @Body() body: CreateProductRequest,
    @Request() request: Request
  ) {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken) return { message: "Token invalid", statusCode: 401 };

      // slug generation
      let slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");

      const productsRepository = AppDataSource.getRepository(Product);

      const newProduct = {
        title: body.title,
        slug,
        image: body.image,
        price: body.price ? Number(body.price) : 0, // convert to number
        specifications: body.specifications || "",
        description: body.description || "",
        meta_title: body.meta_title,
        meta_img: body.meta_img,
        meta_description: body.meta_description || "",
        meta_keywords: body.meta_keywords || "",
      };

      if (
        decodedToken.user_type === "Admin" ||
        decodedToken.user_type === "chipped_monkey_admin" ||
        decodedToken.user_type === "supervisor"
      ) {
        const savedBlog = await productsRepository.save(newProduct);
        return {
          message: "Products created successfully",
          data: savedBlog,
          statusCode: 201,
        };
      } else {
        return { message: "Invalid user type", statusCode: 422 };
      }
    } catch (error) {
      return { message: "Failed to create product", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Put("/update/{id}")
  public async editBlog(
    @Path() id: number,
    @Body() body: CreateProductRequest,
    @Request() request: Request
  ) {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken) return { message: "Token invalid", statusCode: 401 };

      const blogsRepository = AppDataSource.getRepository(Product);

      // Find existing blog
      const existingBlog = await blogsRepository.findOne({ where: { id } });
      if (!existingBlog) {
        return { message: "Blog not found", statusCode: 404 };
      }

      // Only admin users allowed
      if (
        decodedToken.user_type !== "Admin" &&
        decodedToken.user_type !== "chipped_monkey_admin" &&
        decodedToken.user_type !== "supervisor"
      ) {
        return { message: "Invalid user type", statusCode: 422 };
      }

      // Update slug if title changed
      let slug = existingBlog.slug;
      if (body.title && body.title !== existingBlog.title) {
        slug = body.title
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, "-");
      }

      // Update fields
      existingBlog.title = body.title ?? existingBlog.title;
      existingBlog.slug = slug;
      existingBlog.image = body.image ?? existingBlog.image;
      // existingBlog.short_description = body.short_description ?? existingBlog.short_description;
      existingBlog.description = body.description ?? existingBlog.description;
      existingBlog.meta_title = body.meta_title ?? existingBlog.meta_title;
      existingBlog.meta_img = body.meta_img ?? existingBlog.meta_img;
      existingBlog.meta_description =
        body.meta_description ?? existingBlog.meta_description;
      existingBlog.meta_keywords =
        body.meta_keywords ?? existingBlog.meta_keywords;

      const updatedBlog = await blogsRepository.save(existingBlog);

      return {
        message: "Blog updated successfully",
        data: updatedBlog,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to update blog", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/edit/:id")
  public async getProductForEdit(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const productsRepository = AppDataSource.getRepository(Product);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      const products = await productsRepository.findOne({ where: { id } });

      if (!products) {
        return { message: "Product not found", statusCode: 404 };
      }

      // Function to get Upload data from ID or comma-separated IDs
      const getUploadFiles = async (field?: string | null) => {
        if (!field) return [];
        const ids = field.split(",").map((id) => parseInt(id, 10));
        const files = await uploadsRepository.findByIds(ids);
        return files.map((f) => ({ id: f.id, file_name: f.file_name }));
      };

      const imageData = await getUploadFiles(products.image);
      const metaImageData = await getUploadFiles(products.meta_img);

      return {
        message: "Products details fetched successfully",
        data: {
          ...products,
          imageData, // array of file info for main image
          metaImageData, // array of file info for meta image
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch products details", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/orders/details/:id")
  public async getOrderProductForEdit(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const orderRepository = AppDataSource.getRepository(Order);
      const orderProductsRepository =
        AppDataSource.getRepository(OrderProducts);

      const orders = await orderRepository.findOne({ where: { id } });

      if (!orders) {
        return { message: "Order not found", statusCode: 404 };
      }

      // Fetch all products related to this order
      const orderProducts = await orderProductsRepository.find({
        where: { order_id: String(orders.id) },
      });

      return {
        message: "Order details fetched successfully",
        data: {
          ...orders,
          products: orderProducts, // Add products here
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch order details", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Delete("/delete/{id}")
  public async deleteProducts(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (decodedToken && typeof decodedToken === "object") {
        const product = await productRepository.findOne({ where: { id } });

        if (!product) {
          return { message: "Products not found", statusCode: 404 };
        }

        await productRepository.remove(product);
      } else {
        return { message: "Token not found", statusCode: 404 };
      }

      return { message: "Products deleted successfully", statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { message: "Failed to delete Products", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Delete("/order/delete/{id}")
  public async deleteOrderProducts(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const productRepository = AppDataSource.getRepository(Order);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (decodedToken && typeof decodedToken === "object") {
        const product = await productRepository.findOne({ where: { id } });

        if (!product) {
          return { message: "Orders not found", statusCode: 404 };
        }

        await productRepository.remove(product);
      } else {
        return { message: "Token not found", statusCode: 404 };
      }

      return { message: "Orders deleted successfully", statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { message: "Failed to delete orders", statusCode: 422 };
    }
  }
}
