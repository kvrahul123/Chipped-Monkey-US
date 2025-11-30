import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Order } from "./entities/Order";
import { Blogs } from "./entities/Blogs";
import { Product } from "./entities/Products";
import { Uploads } from "./entities/Uploads";
import { MicrochipOrders } from "./entities/MicrochipOrders";
import { TransactionRequest } from "./entities/TransactionRequest";
import { Contact } from "./entities/Contact";
import { OrderProducts } from "./entities/OrderProducts";
import { Package } from "./entities/Package";
import { PackageDetails } from "./entities/PackageDetails";
import { Gender } from "./entities/Gender";
import { BreederDetail } from "./entities/BreederDetails";
import { ExternalMicrochip } from "./entities/ExternalMicrochip";
import { Pages } from "./entities/Pages";
import { Enquiry } from "./entities/Enquiry";
import { AssignedMicrochip } from "./entities/AssignedMicrochip";
import { WhatsappTemplate } from "./entities/WhatsappTemplate";
import { WhatsappMessageLog } from "./entities/WhatsappMessageLog";
import { TransactionDetails } from "./entities/TransactionDetails";
import { ImplantedMicrochip } from "./entities/ImplantedMicrochip";
import { OrderAddresses } from "./entities/OrderAddresses";
import { MicrochipPayment } from "./entities/MicrochipPayment";
import { MicrochipPaymentDetails } from "./entities/MicrochipPaymentDetails";
import { ImplantersAmount } from "./entities/ImplantersAmount";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,  // Assuming you're using the root user
  password:  process.env.DB_PASS,      // No password
  database: process.env.DB_NAME, // Database name
  synchronize: false, // Automatically synchronize the schema (use in development only)
  logging: true,
  entities: [User,Order,Pages,ExternalMicrochip,ImplantersAmount,MicrochipPaymentDetails,MicrochipPayment,OrderAddresses,ImplantedMicrochip,TransactionDetails,WhatsappMessageLog,WhatsappTemplate,AssignedMicrochip,Enquiry,Blogs,BreederDetail,Product,Uploads,MicrochipOrders,TransactionRequest,Contact,OrderProducts,Package,PackageDetails,Gender],  // Your entities
  migrations: [],
  subscribers: [],
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
