import { Request, Response } from "express";
import { completeHabit } from "../services/completion.service.js";

export async function complete(req: Request, res: Response) {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    //take out habitId
    const { id } = req.params;

    //call the service function
    const completion = await completeHabit(id, req.userId);

    res.status(201).json({
      message: "Habit completed successfully",
      completion,
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to complete habit",
    });
  }
}
