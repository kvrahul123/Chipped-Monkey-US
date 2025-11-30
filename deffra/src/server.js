"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const routes_1 = require("./routes/routes"); // TSOA-generated routes
const data_source_1 = require("../data-source"); // Your data source
const dotenv = __importStar(require("dotenv"));
const tsoa_1 = require("tsoa");
dotenv.config();
const app = (0, express_1.default)();
const cors = require('cors');
app.use('/uploads/all/', express_1.default.static('./uploads/pet_images'));
app.use('/uploads/', express_1.default.static('./uploads/'));
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const upload = (0, multer_1.default)();
// Initialize database connection 
data_source_1.AppDataSource.initialize().then(() => {
    (0, routes_1.RegisterRoutes)(app); // Register TSOA routes
    app.use((err, req, res, next) => {
        if (err instanceof tsoa_1.ValidateError) {
            console.error("Validation Error: ", err.fields); // Log validation errors
            res.status(422).json({
                message: "Validation failed",
                details: err.fields,
            });
        }
        else {
            console.error("Internal Server Error: ", err); // Log all other errors
            res.status(500).json({ message: "Internal server error" });
        }
    });
    app.listen(8001, () => {
        console.log("Server is running on port 8001");
    });
}).catch((error) => {
    console.error("Error during Data Source initialization", error);
});
