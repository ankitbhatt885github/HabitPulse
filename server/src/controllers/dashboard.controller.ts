import { Request, Response } from "express";
import { getDashboard } from "../services/dashboard.service.js";

export async function get(req: Request,
  res: Response){

    try{

        if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    //get the imp dashboard details
    const dashboard = await getDashboard(req.userId);

    res.status(200).json({
      dashboard,
    });

    } catch(error){
        res.status(500).json({
      message: "Failed to fetch dashboard",
    });
    }
}