import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function protect(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message: "JWT_SECRET is not defined",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    //jwt.verify() return payload that has userId, it was defined in jwt.sign()
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
