import { Request, Response } from "express";
import {
  completeHabit,
  getHabitCompletions,
  uncompleteHabit,
  getHabitStreak,
} from "../services/completion.service.js";

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

export async function getHistory(req: Request, res: Response) {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }
    //find habitId
    const { id } = req.params;

    const completions = await getHabitCompletions(id, req.userId);

    res.status(200).json({
      completions,
    });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch completions",
    });
  }
}

export async function uncomplete(req: Request, res: Response) {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }
    const { id } = req.params;

    const completion = await uncompleteHabit(id, req.userId);

    if (!completion) {
      res.status(404).json({
        message: "Habit is not completed today",
      });
      return;
    }

    res.status(200).json({
      message: "Habit marked as incomplete",
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to uncomplete habit",
    });
  }
}

export async function getStreak(req: Request, res: Response) {
  try {
    //is user authenticated?
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    const { id } = req.params;

    //get the streak object
    const streak = await getHabitStreak(id, req.userId);

    res.status(200).json({
      streak,
    });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Failed to calculate streak",
    });
  }
}
