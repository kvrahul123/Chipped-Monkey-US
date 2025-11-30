import { Body, Controller, Get, Path, Put, Route, Security,Request } from "tsoa";
import { WhatsappTemplate } from "../../entities/WhatsappTemplate";
import { AppDataSource } from "../../data-source";
import { DeepPartial } from "typeorm";
import { jwt } from "twilio";
import { decodeToken, getTokenFromRequest } from "../utilities/TokenUtility";


// dto/UpdateWhatsappTemplateDto.ts
// dto/UpdateWhatsappTemplateDto.ts
export interface UpdateWhatsappTemplateDto {
  label?: string;
  message?: string;
  status?: string; // optional if you want to allow updating status
}



@Route("whatsapp")
export class WhatsappController extends Controller {
  @Get("/lists")
  public async getWhatsappLists(): Promise<{
    message: string;
    data?: WhatsappTemplate[];
    statusCode: number;
  }> {
    try {
      const whatsappTemplateRepo = AppDataSource.getRepository(WhatsappTemplate);
      const templates = await whatsappTemplateRepo.find();

      return {
        message: "Whatsapp templates fetched successfully",
        data: templates,
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        message: error.message || "Failed to fetch whatsapp templates",
        statusCode: 500,
      };
    }
  }
    
    
    
 @Security("jwt")
  @Put("/update/{id}")
  public async updateWhatsappTemplate(
    @Path() id: number,
    @Body() body: UpdateWhatsappTemplateDto,
    @Request() request: any
  ): Promise<{
    message: string;
    data?: WhatsappTemplate;
    statusCode: number;
  }> {
    try {
      const actualToken = getTokenFromRequest(request);
      const decodedToken = decodeToken(actualToken);

      if (!decodedToken || typeof decodedToken !== "object") {
        return {
          message: "No token provided or invalid token",
          statusCode: 401,
        };
      }

      if (decodedToken.user_type !== "Admin") {
        return {
          message: "Invalid user type",
          statusCode: 403,
        };
      }

      const whatsappTemplateRepo = AppDataSource.getRepository(WhatsappTemplate);

      const template = await whatsappTemplateRepo.findOne({ where: { id } });
      if (!template) {
        return {
          message: `Whatsapp template with id ${id} not found`,
          statusCode: 404,
        };
      }

      // merge only allowed fields
      whatsappTemplateRepo.merge(template, body);

      const updatedTemplate = await whatsappTemplateRepo.save(template);

      return {
        message: "Whatsapp template updated successfully",
        data: updatedTemplate,
        statusCode: 200,
      };
    } catch (error: any) {
      return {
        message: error.message || "Failed to update whatsapp template",
        statusCode: 500,
      };
    }
  }
}
