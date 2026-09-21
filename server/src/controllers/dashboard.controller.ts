import { Request, Response } from "express";
import { getDashboard, getHabitStats } from "../services/dashboard.service.js";

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


export async function getStats (
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    const { id } = req.params;

    const stats = await getHabitStats(
      id,
      req.userId
    );

    res.status(200).json({
      stats,
    });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch habit stats",
    });
  }
};