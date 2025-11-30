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
import { Blogs } from "../../entities/Blogs";
import { Uploads } from "../../entities/Uploads";
import { Pages } from "../../entities/Pages";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CreatePageRequest {
  title: string;
  slug?: string;
  meta_image?: string;
  content?: string;
  meta_title: string;
  meta_description?: string;
  keywords?: string;
  faqs?: FaqItem[];  // 👈 fix here
}


@Route("pages")
export class PagesController extends Controller {
  @Get("/lists")
  public async getPagesLists(): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const pagesRepository = AppDataSource.getRepository(Pages);
      const uploadsRepository = AppDataSource.getRepository(Uploads);
      const pages = await pagesRepository.find({
        where: { deleted_at: IsNull() },
        order: { id: "DESC" },
      });

      if (!pages.length) {
        return { message: "No pages found", statusCode: 422 };
      }

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
        message: "Pages retrieved successfully",
        data: pagesWithImages,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve pages", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Get("/edit/:id")
  public async getPageForEdit(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; data?: any; statusCode: number }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return { message: "Token not found or invalid", statusCode: 401 };
      }

      const pagesRepository = AppDataSource.getRepository(Pages);
      const uploadsRepository = AppDataSource.getRepository(Uploads);

      const page = await pagesRepository.findOne({ where: { id } });

      if (!page) {
        return { message: "Pages not found", statusCode: 404 };
      }

      // Function to get Upload data from ID or comma-separated IDs
      const getUploadFiles = async (field?: string | null) => {
        if (!field) return [];
        const ids = field.split(",").map((id) => parseInt(id, 10));
        const files = await uploadsRepository.findByIds(ids);
        return files.map((f) => ({ id: f.id, file_name: f.file_name }));
      };

      const metaImageData = await getUploadFiles(page.meta_image);

      return {
        message: "Pages details fetched successfully",
        data: {
          ...page,
          metaImageData, // array of file info for meta image
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to fetch pages details", statusCode: 422 };
    }
  }

  @Security("jwt")
  @Put("/update/{id}")
  public async editBlog(
    @Path() id: number,
    @Body() body: CreatePageRequest,
    @Request() request: Request
  ) {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken) return { message: "Token invalid", statusCode: 401 };

      const pagesRepository = AppDataSource.getRepository(Pages);

      // Find existing blog
      const existingPages = await pagesRepository.findOne({ where: { id } });
      if (!existingPages) {
        return { message: "PAge not found", statusCode: 404 };
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
      let slug = existingPages.slug;
      if (body.title && body.title !== existingPages.title) {
        slug = body.title
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, "-");
      }

      // Update fields
      existingPages.title = body.title ?? existingPages.title;
      existingPages.slug = slug;
      existingPages.meta_image = body.meta_image ?? existingPages.meta_image;
      existingPages.content = body.content ?? existingPages.content;
      existingPages.meta_title = body.meta_title ?? existingPages.meta_title;
      existingPages.meta_description =
        body.meta_description ?? existingPages.meta_description;
      existingPages.keywords = body.keywords ?? existingPages.keywords;
      existingPages.faq_content = body.faqs
        ? JSON.stringify(body.faqs)
        : existingPages.faq_content;
      const updatedBlog = await pagesRepository.save(existingPages);

      return {
        message: "Page updated successfully",
        data: updatedBlog,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { message: "Failed to update page", statusCode: 422 };
    }
  }
}
