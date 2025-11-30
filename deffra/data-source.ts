import { DataSource } from "typeorm";
import { ExternalMicrochip } from "./entities/ExternalMicrochip";
import { Contact } from "./entities/Contact";



export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,  // Assuming you're using the root user
  password:  process.env.DB_PASS,      // No password
  database: process.env.DB_NAME, // Database name

  synchronize: false, // Automatically synchronize the schema (use in development only)
  logging: true,
  entities: [ExternalMicrochip,Contact],  // Your entities
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
