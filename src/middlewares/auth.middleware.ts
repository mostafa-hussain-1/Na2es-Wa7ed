import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Forbeddin, please sign in" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as unknown as { id: string };
        
        req.user = { id: decoded.id };
        
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};