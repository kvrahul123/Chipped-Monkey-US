import { decode } from 'jsonwebtoken';

export function getTokenFromRequest(request: any): string | null {
    const token = request.headers["authorization"] as string | '';
    if (token && token.startsWith('Bearer ')) {
        return token.split(' ')[1]; // Return the actual token without the 'Bearer' part
    }
    return null; // Return null if no token is found
}

export function decodeToken(token: string | null): any {
    if (token) {
        return decode(token); // Decode the token if it's available
    }
    return null; // Return null if no token is provided
}
