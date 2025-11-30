import {
  Get,
  Route,
  Controller,
  Query,
} from "tsoa";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/Contact";
import { ExternalMicrochip } from "../../entities/ExternalMicrochip";
import dotenv from "dotenv";
dotenv.config();

export type CheckMicrochipResponse = "ERROR" | "INFO" | "FALSE" | "TRUE" | true | false;

@Route("")
export class DeffraController extends Controller {
  
  @Get("/check")
  public async checkMicrochip(
    @Query() username?: string,
    @Query() password?: string,
    @Query() chipnumber?: string
  ): Promise<CheckMicrochipResponse> {

    try {
      // 1️⃣ Missing credentials
      if (!username || !password) {
        return "ERROR";
      }

      // 2️⃣ Valid credentials mapping
      const validCredentials: Record<string, string> = {
        [process.env.DB_ANIMALDATAUSER!]: process.env.DB_ANIMALDATAPASSWORD!,
        [process.env.DB_DKCUSER!]: process.env.DB_DKCPASSWORD!,
        [process.env.DB_CHIPWORKSUSER!]: process.env.DB_CHIPWORKSPASSWORD!,
        [process.env.DB_HOMEAGAINUKUSER!]: process.env.DB_HOMEAGAINUKPASSWORD!,
        [process.env.DB_IDENTIBASEUSER!]: process.env.DB_IDENTIBASEPASSWORD!,
        [process.env.DB_LOSTPAWSUSER!]: process.env.DB_LOSTPAWSPASSWORD!,
        [process.env.DB_MICRODOGIDUSER!]: process.env.DB_MICRODOGIDPASSWORD!,
        [process.env.DB_MYANIMALTRACEUSER!]: process.env.DB_MYANIMALTRACEPASSWORD!,
        [process.env.DB_MYPETHQUSER!]: process.env.DB_MYPETHQPASSWORD!,
        [process.env.DB_NVDSUSER!]: process.env.DB_NVDSPASSWORD!,
        [process.env.DB_PETDATABASEUSER!]: process.env.DB_PETDATABASEPASSWORD!,
        [process.env.DB_PETLOGUSER!]: process.env.DB_PETLOGPASSWORD!,
        [process.env.DB_PETSCANNERUSER!]: process.env.DB_PETSCANNERPASSWORD!,
        [process.env.DB_PETTRACUSER!]: process.env.DB_PETTRACPASSWORD!,
        [process.env.DB_PETIDENTITYUKUSER!]: process.env.DB_PETIDENTITYUKPASSWORD!,
        [process.env.DB_SMARTTRACEUSER!]: process.env.DB_SMARTTRACEPASSWORD!,
        [process.env.DB_TRACKYOURPAWSUSER!]: process.env.DB_TRACKYOURPAWSPASSWORD!,
        [process.env.DB_CHIPHEROUSER!]: process.env.DB_CHIPHEROPASSWORD!,
        [process.env.DB_GLOBALPETSUSER!]: process.env.DB_GLOBALPETSPASSWORD!,
        [process.env.DB_PROTECTEDPETUSER!]: process.env.DB_PROTECTEDPETPASSWORD!,
      };

      // 3️⃣ Validate credentials
      if (!(username in validCredentials) || validCredentials[username] !== password) {
        return "ERROR";
      }

      // 4️⃣ Validate chip number
      if (!chipnumber || chipnumber.length < 15) {
        return "ERROR";
      }

      const contactRepo = AppDataSource.getRepository(Contact);
      const externalRepo = AppDataSource.getRepository(ExternalMicrochip);

      const microchip = await contactRepo.findOne({ where: { microchip_number: chipnumber } });
      const externalMicrochip = await externalRepo.findOne({ where: { microchip_number: chipnumber } });

      // 5️⃣ Special rule for PET_TRAC
      const isPetTrac = (username.toLowerCase() === "pet_trac" || username.toLowerCase()==="nvds") ;

      if (microchip) {
        return isPetTrac ? true : "TRUE";
      }

      if (externalMicrochip) {
        // INFO still always string
        return "INFO";
      }

      // Not found
      return isPetTrac ? false : "FALSE";

    } catch (error) {
      console.error("Error in /check:", error);
      return "ERROR";
    }
  }
}
