import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzI3MTk5MDI3fQ.KrYzSetPZXiq7J7gySGnQ2XWPtSavMPxn1rqMcZc-OQ'; // Use env variables in production

// Custom Error Class for throwing errors with status codes
class HttpError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const expressAuthentication = async (
    request: Request,
    securityName: string,
    _scopes?: string[],
    response?: Response // Add the response object to send JSON directly
): Promise<any> => {
    if (securityName === 'jwt') {
        const authHeader = request.headers['authorization'];
        const token = authHeader?.split(' ')[1]; // Get token from Authorization header

        if (!token) {
            return response?.status(401).json({
                message: 'No token provided',
                status: 401
            }); // Return JSON for no token
        }

        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    response?.status(403).json({
                        message: 'Invalid token',
                        status: 403
                    }); 
                } else {
                    resolve(decoded); 
                }
            });
        });
    } else {
        return response?.status(400).json({
            message: 'Authentication method not supported',
            status: 400
        }); // Return JSON for unsupported authentication method
    }
};
