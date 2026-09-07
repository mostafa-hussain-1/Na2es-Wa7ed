import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";
import { Team } from "../models/team.model.js";
import { Project } from "../models/project.model.js";


export interface AuthRequest extends Request {
    user?: { id: string };
    team?: InstanceType<typeof Team>; 
    project?: InstanceType<typeof Project>;
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


export const verifyOwnership = (
    DbModel: Model<any>, 
    ownerFieldName: string, 
    reqObjectName: string, 
    needMatch: boolean
) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const tokenID = req.user?.id;
            const { id } = req.params;

            const doc = await DbModel.findById(id);
            if (!doc) {
                return res.status(404).json({ message: "Data not found" });
            }

            const targetID = doc[ownerFieldName].toString();

            const valid = needMatch ? tokenID === targetID : tokenID !== targetID;

            if (valid) {
                (req as any)[reqObjectName] = doc; 
                next();
            } else {
                return res.status(403).json({ message: "Forbidden" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    };
};