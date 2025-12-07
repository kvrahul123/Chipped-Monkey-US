import { Get, Route, Controller, Query } from "tsoa";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/Contact";
import { ExternalMicrochip } from "../../entities/ExternalMicrochip";
import dotenv from "dotenv";

dotenv.config();

@Route("v1.0")
export class PetLookUpController extends Controller {
  @Get("/AAHALookup")
  public async petLookUp(
    @Query() id?: string // ✅ Only microchip ID
  ): Promise<any> {
    try {
      // ✅ 1. VALIDATE INPUT
      if (!id) {
        this.setStatus(400);
        return {
          isRegistered: false,
          ownerLastUpdateDate: null,
          isDistributed: false,
        };
      }

      const contactRepository = AppDataSource.getRepository(Contact);

      // ✅ 2. CHECK REGISTERED MICROCHIP
      const contact = await contactRepository.findOne({
        where: { microchip_number: id.trim() },
        select: ["id", "updated_at"],
      });

      // 🟢 CASE 1: REGISTERED WITH OWNER
      if (contact) {
        if (!contact.updated_at) {
          // Safety fallback – should not normally happen
          return {
            isRegistered: true,
            ownerLastUpdateDate: null,
            isDistributed: true,
          };
        }

        const date = new Date(contact.updated_at as any);

        const formattedDate =
          date.getUTCFullYear() +
          "-" +
          String(date.getUTCMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getUTCDate()).padStart(2, "0") +
          "T" +
          String(date.getUTCHours()).padStart(2, "0") +
          ":" +
          String(date.getUTCMinutes()).padStart(2, "0") +
          ":" +
          String(date.getUTCSeconds()).padStart(2, "0") +
          ".0000000";

        return {
          isRegistered: true,
          ownerLastUpdateDate: formattedDate,
          isDistributed: true,
        };
      }

      // ✅ 3. OPTIONAL: CHECK DISTRIBUTED MICROCHIP
      if (id.trim().startsWith("901")) {
        return {
          isRegistered: false,
          ownerLastUpdateDate: null,
          isDistributed: true, // or true if you want
        };
      }

      // 🔴 CASE 3: NOT FOUND ANYWHERE
      return {
        isRegistered: false,
        ownerLastUpdateDate: null,
        isDistributed: false,
      };
    } catch (error) {
      console.error("AAHA Lookup Error:", error);
      this.setStatus(500);
      return {
        isRegistered: false,
        ownerLastUpdateDate: null,
        isDistributed: false,
      };
    }
  }
}
