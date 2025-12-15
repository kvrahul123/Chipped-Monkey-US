import express from "express";
import multer from "multer";
import { RegisterRoutes } from "./routes/routes"; // TSOA-generated routes
import { AppDataSource } from "../data-source"; // Your data source
import * as dotenv from "dotenv";
import { ValidateError } from "tsoa";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

dotenv.config();

const app = express();
const cors = require("cors");
app.use("/uploads/all/", express.static("./uploads/pet_images"));
app.use("/uploads/", express.static("./uploads/"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer();

// Rate limiter

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    const apiRouter = express.Router();

    // Only this API is rate-limited
const frontendLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => ipKeyGenerator(req.ip||""),

  handler: (req, res) => {
    res.status(403).json({
      message: "Too many requests, please try again later.",
      statusCode: 403,
    });
  },
});


    // Apply limiter only to this route
    apiRouter.use("/frontend/microchip/check", frontendLimiter);

    RegisterRoutes(apiRouter);

    // Mount router on /api
    app.use("/", apiRouter);

    app.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof ValidateError) {
        console.error("Validation Error: ", err.fields); // Log validation errors
        res.status(422).json({
          message: "Validation failed",
          details: err.fields,
        });
      } else {
        console.error("Internal Server Error: ", err); // Log all other errors
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });
