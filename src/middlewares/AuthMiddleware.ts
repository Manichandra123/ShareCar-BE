import dotenv from "dotenv";
dotenv.config();

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SCRECT;  
 
declare global {
  namespace Express {
    interface Request {
      userid?: string;
    }
  }
}

export default function AuthMiddleware(  
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
  
    if (!JWT_SECRET) {
      return res.status(500).json({ 
        msg: "Server configuration error" 
      });
    }

    const authHeader = req.headers["authorization"];
    
 
    if (!authHeader) {
        res.status(401).json({ 
        msg: "No token provided" 
      });
      return
    }

 
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.slice(7) 
      : authHeader;
 
    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
 
    if (decodedToken && decodedToken.id) {
      req.userid = decodedToken.id;
      next();  
    } else {
        res.status(401).json({ 
        msg: "Invalid token" 
      });
       return
    }

  } catch (error) {
    console.error("middleware error:", error);
    
 
    if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
        msg: "Invalid token"
      });
       return
    } else if (error instanceof jwt.TokenExpiredError) {
       res.status(401).json({
        msg: "Token expired"
      });
       return
    }
    
     res.status(500).json({
      message: "Internal server error",
    });
    return 
  }
}