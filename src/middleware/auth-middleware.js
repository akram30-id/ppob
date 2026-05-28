import jwt from "jsonwebtoken";
import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        res.status(401).json({
            "status": 108,
            "message": "Token tidak tidak valid atau kadaluwarsa.",
            "data": null
        }).end()
    } else {

        try {
            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = decoded;

            next();
        } catch (error) {
            res.status(401).json({
                "status": 108,
                "message": "Token tidak tidak valid atau kadaluwarsa.",
                "data": null
            }).end()
        }
    }
}