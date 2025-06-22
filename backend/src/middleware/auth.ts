import jwt from 'jsonwebtoken';
import { Response } from "express";
import {NextFunction} from "express";

import { IRequestWithUser } from "../types";

interface JwtPayload {
    user: {
        id: string;
    }
}

const JWT_SECRET: string = process.env.JWTSCERET || "";

if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is not defined');
    throw new Error('JWT_SECRET must be defined in environment variables');
}

/**
 * Authentication middleware to verify JWT tokens
 * @param req - Express request object with user property
 * @param res - Express response object
 * @param next - Express next function
 * @returns Response when authentication fails (sends 401 error), void when authentication succeeds (calls next())
 */
const auth = (req: IRequestWithUser, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            error: 'Authentication required',
            message: 'No authorization header provided'
        });

        return;
    }

    // Check for Bearer token format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
            error: 'Invalid token format',
            message: 'Authorization header must be in format: Bearer <token>'
        });

        return;
    }

    const token = parts[1];

    if(!token) {
        res.status(401).json({ "error": "Login First"});
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (!decoded.user || !decoded.user.id) {
            res.status(401).json({
                error: 'Invalid token',
                message: 'Token payload is malformed'
            });

            return;
        }
        req.user = decoded.user; //decoded.user is { id: userId }
        next();
    } catch (e) {
        res.status(401).json({ "error": "Login First"});
    }
}

export default auth;