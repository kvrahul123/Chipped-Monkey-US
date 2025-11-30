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
import { Package } from "../../entities/Package";
import { User } from "../../entities/User";
import { PackageDetails } from "../../entities/PackageDetails";


@Route("package")
export class PackageController extends Controller {
  @Get("/lists")
  public async getProductLists(): Promise<{
    message: string;
    data?: any[];
    statusCode: number;
  }> {
    try {
      const packageRepository = AppDataSource.getRepository(Package);
      const packageDetailsRepository=AppDataSource.getRepository(PackageDetails);
      const userRepository = AppDataSource.getRepository(User); // assuming you have a User entity
      const packages = await packageRepository.find({
        order: { id: "DESC" },
      });

      if (!packages.length) {
        return { message: "No package found", statusCode: 422 };
      }

      const Apackage = await Promise.all(
        packages.map(async (p) => {
          const user = await userRepository.findOne({
            where: { id: Number(p.user_id) }, // assuming Package has user_id field
          });

        const packageDetails = await packageDetailsRepository.findOne({
            where: { id: Number(p.package_id) }, // assuming Package has user_id field
          });

          return {
            ...p,
            user_name: user ? user.name : null, // map the user's name
            packageName:packageDetails?packageDetails.package_name:null
          };
        })
      );

      return {
        message: "Packages retrieved successfully",
        data: Apackage,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return { message: "Failed to retrieve product", statusCode: 422 };
    }
  }
}
