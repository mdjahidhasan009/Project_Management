import jwt from 'jsonwebtoken';
import { Response } from "express";
import {NextFunction} from "express";

import {IRequestWithUser} from "../types";

interface JwtPayload {
    user: {
        id: string;
    }
}

const JWT_Secret: string = process.env.JWTSCERET || "";

//Verifying token
const auth = (req: IRequestWithUser, res: Response, next: NextFunction): void | Response => {
    let token: string | null = null;

    if(req.headers.authorization)
        token = req.headers.authorization.split(' ')[1]; //'Authorization: 'Bearer token' token structure

    if(!token) return res.status(401).json({ "error": "Login First"});

    try {
        const decoded: JwtPayload = jwt.verify(token, JWT_Secret);
        req.user = decoded.user; //decoded.user is { id: userId }
        next();
    } catch (e) {
        res.status(401).json({ "error": "Login First"});
    }
}

export default auth;