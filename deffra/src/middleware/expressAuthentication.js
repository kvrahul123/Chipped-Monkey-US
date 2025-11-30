"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzI3MTk5MDI3fQ.KrYzSetPZXiq7J7gySGnQ2XWPtSavMPxn1rqMcZc-OQ'; // Use env variables in production
// Custom Error Class for throwing errors with status codes
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const expressAuthentication = (request, securityName, _scopes, response // Add the response object to send JSON directly
) => __awaiter(void 0, void 0, void 0, function* () {
    if (securityName === 'jwt') {
        const authHeader = request.headers['authorization'];
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]; // Get token from Authorization header
        if (!token) {
            return response === null || response === void 0 ? void 0 : response.status(401).json({
                message: 'No token provided',
                status: 401
            }); // Return JSON for no token
        }
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    response === null || response === void 0 ? void 0 : response.status(403).json({
                        message: 'Invalid token',
                        status: 403
                    });
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
    else {
        return response === null || response === void 0 ? void 0 : response.status(400).json({
            message: 'Authentication method not supported',
            status: 400
        }); // Return JSON for unsupported authentication method
    }
});
exports.expressAuthentication = expressAuthentication;
