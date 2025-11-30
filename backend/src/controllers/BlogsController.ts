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

export interface CreateBlogRequest {
  title: string;
  slug?: string;
  image?: string;
  short_description?: string;
  description?: string;
  meta_title: string;
  meta_img?: string;
  meta_description?: string;
  meta_keywords?: string;
}

@Route("blogs")
export class BlogsController extends Controller {
  @Get("/lists")
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
  @Security("jwt")
  @Post("/create")
  public async createBlogs(
    @Body() body: CreateBlogRequest,
    @Request() request: Request
  ) {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken) return { message: "Token invalid", statusCode: 401 };

      console.log("decode token" + JSON.stringify(decodeToken));

      // slug generation
      let slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");

      const blogsRepository = AppDataSource.getRepository(Blogs);

      const newBlog = {
        title: body.title,
        slug,
        image: body.image, // or store your file path
        short_description: body.short_description || "",
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
        const savedBlog = await blogsRepository.save(newBlog);
        return {
          message: "Blog created successfully",
          data: savedBlog,
          statusCode: 201,
        };
      } else {
        return { message: "Invalid user type", statusCode: 422 };
      }
    } catch (error) {
      return { message: "Failed to create blog", statusCode: 422 };
    }
  }

  @Security("jwt")
@Put("/update/{id}")
public async editBlog(
  @Path() id: number,
  @Body() body: CreateBlogRequest,
  @Request() request: Request
) {
  try {
    const actualToken = getTokenFromRequest(request);
    const decodedToken = decodeToken(actualToken);

    if (!decodedToken) return { message: "Token invalid", statusCode: 401 };

    const blogsRepository = AppDataSource.getRepository(Blogs);

    // Find existing blog
    const existingBlog = await blogsRepository.findOne({ where: { id } });
    if (!existingBlog) {
      return { message: "Blog not found", statusCode: 404 };
    }

    // Only admin users allowed
    if (
      decodedToken.user_type !== "Admin" &&
      decodedToken.user_type !== "chipped_monkey_admin" ||
        decodedToken.user_type !== "supervisor"
    ) {
      return { message: "Invalid user type", statusCode: 422 };
    }

    // Update slug if title changed
    let slug = existingBlog.slug;
    if (body.title && body.title !== existingBlog.title) {
      slug = body.title.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
    }

    // Update fields
    existingBlog.title = body.title ?? existingBlog.title;
    existingBlog.slug = slug;
    existingBlog.image = body.image ?? existingBlog.image;
    existingBlog.short_description = body.short_description ?? existingBlog.short_description;
    existingBlog.description = body.description ?? existingBlog.description;
    existingBlog.meta_title = body.meta_title ?? existingBlog.meta_title;
    existingBlog.meta_img = body.meta_img ?? existingBlog.meta_img;
    existingBlog.meta_description = body.meta_description ?? existingBlog.meta_description;
    existingBlog.meta_keywords = body.meta_keywords ?? existingBlog.meta_keywords;

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
public async getBlogForEdit(
  @Path() id: number,
  @Request() request: any
): Promise<{ message: string; data?: any; statusCode: number }> {
  try {
    const actualToken = getTokenFromRequest(request);
    const decodedToken = decodeToken(actualToken);

    if (!decodedToken || typeof decodedToken !== "object") {
      return { message: "Token not found or invalid", statusCode: 401 };
    }

    const blogsRepository = AppDataSource.getRepository(Blogs);
    const uploadsRepository = AppDataSource.getRepository(Uploads);

    const blog = await blogsRepository.findOne({ where: { id } });

    if (!blog) {
      return { message: "Blog not found", statusCode: 404 };
    }

    // Function to get Upload data from ID or comma-separated IDs
    const getUploadFiles = async (field?: string | null) => {
      if (!field) return [];
      const ids = field.split(",").map((id) => parseInt(id, 10));
      const files = await uploadsRepository.findByIds(ids);
      return files.map((f) => ({ id: f.id, file_name: f.file_name }));
    };

    const imageData = await getUploadFiles(blog.image);
    const metaImageData = await getUploadFiles(blog.meta_img);

    return {
      message: "Blog details fetched successfully",
      data: {
        ...blog,
        imageData,      // array of file info for main image
        metaImageData,  // array of file info for meta image
      },
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return { message: "Failed to fetch blog details", statusCode: 422 };
  }
}


  @Security("jwt")
  @Delete("/delete/{id}")
  public async deleteBlogs(
    @Path() id: number,
    @Request() request: any
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const blogsRepository = AppDataSource.getRepository(Blogs);
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (decodedToken && typeof decodedToken === "object") {
        const blogs = await blogsRepository.findOne({ where: { id } });

        if (!blogs) {
          return { message: "Blogs not found", statusCode: 404 };
        }

        await blogsRepository.remove(blogs);
      } else {
        return { message: "Token not found", statusCode: 404 };
      }

      return { message: "Blogs deleted successfully", statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { message: "Failed to delete Blogs", statusCode: 422 };
    }
  }
}
