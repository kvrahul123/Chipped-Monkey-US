import { Get, Route, Controller, Security, Request } from "tsoa";
import { AppDataSource } from "../../data-source";
import { Not, IsNull } from "typeorm";
import { User } from "../../entities/User";
import { getTokenFromRequest, decodeToken } from "../utilities/TokenUtility";
import { Order } from "../../entities/Order";
import { Product } from "../../entities/Products";
import { Blogs } from "../../entities/Blogs";
import { Contact } from "../../entities/Contact";

@Security("jwt")
@Route("dashboard")
export class DashboardController extends Controller {
  @Get("counts")
  public async getDashboardCounts(@Request() request: any): Promise<{
    message: string;
    data: {
      userCount: number;
      orderCount: number;
        productsCount: number;
        microchipCount: number;
      blogsCount: number;
    };
    statusCode: number;
  }> {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const usersRepository = AppDataSource.getRepository(User);
      const productsRepository = AppDataSource.getRepository(Product);
      const blogRepository = AppDataSource.getRepository(Blogs);
      const microchipRepository = AppDataSource.getRepository(Contact);
      const actualToken = getTokenFromRequest(request);

      const decodedToken = decodeToken(actualToken);

      // Count of orders (all users)
      const orderCount = await orderRepository.count();

      let productsCount: number = 0;
      let userCount: number = 0;
      let blogsCount: number = 0;
      let microchipCount: number = 0;

      if (decodedToken && typeof decodedToken === "object") {
        const userId = Number(decodedToken.userId);

        if (
          decodedToken.user_type === "Admin" ||
          decodedToken.user_type === "chipped_monkey_admin" ||
        decodedToken.user_type === "supervisor"
        ) {
          // Admin counts
          productsCount = await productsRepository.count();
          userCount = await usersRepository.count();
          blogsCount = await blogRepository.count();
          microchipCount = await microchipRepository.count();
        } else {
          // Normal user counts
          productsCount = await productsRepository.count({
            where: { id: userId },
          });
          userCount = await usersRepository.count(); // or count only related users if needed
          blogsCount = await blogRepository.count(); // or filter by user if needed
          microchipCount = await microchipRepository.count({
            where: { user_id: userId },
          });
        }

        return {
          message: "Counts retrieved successfully",
          data: {
            userCount,
            orderCount,
              productsCount,
            microchipCount,
            blogsCount,
          },
          statusCode: 200,
        };
      } else {
        return {
          message: "Invalid token",
          data: {
            userCount: 0,
            orderCount: 0,
            productsCount: 0,
              blogsCount: 0,
      microchipCount:0
          },
          statusCode: 401,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        message: "Failed to retrieve counts",
        data: {
          userCount: 0,
          orderCount: 0,
          productsCount: 0,
            blogsCount: 0,
      microchipCount:0
        },
        statusCode: 422,
      };
    }
  }
}
