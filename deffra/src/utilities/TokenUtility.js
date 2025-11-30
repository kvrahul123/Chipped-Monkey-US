"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromRequest = getTokenFromRequest;
exports.decodeToken = decodeToken;
const jsonwebtoken_1 = require("jsonwebtoken");
function getTokenFromRequest(request) {
    const token = request.headers["authorization"];
    if (token && token.startsWith('Bearer ')) {
        return token.split(' ')[1]; // Return the actual token without the 'Bearer' part
    }
    return null; // Return null if no token is found
}
function decodeToken(token) {
    if (token) {
        return (0, jsonwebtoken_1.decode)(token); // Decode the token if it's available
    }
    return null; // Return null if no token is provided
}
