import { Request, Response } from "express";
import { createHabit } from "../services/habit.service.js";

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { name, description, frequency, color } = req.body;
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    //user is authenticated so call createHabit() service using this data
    const habit = await createHabit({
      userId: req.userId,
      name,
      description,
      frequency,
      color,
    });

    res.status(201).json({
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create habit",
    });
  }
}
