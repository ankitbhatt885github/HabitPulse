import { Request, Response } from "express";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
} from "../services/habit.service.js";

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

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }
    //call the service function
    const habits = await getHabits(req.userId);

    res.status(200).json({
      habits,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch habits",
    });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    const { id } = req.params;
    const habit = await getHabitById(id, req.userId);

    if (!habit) {
      res.status(404).json({
        message: "Habit not found",
      });
      return;
    }

    res.status(200).json({
      habit,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch habit",
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    if (!req.userId) {
      //if user is not authenticated
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    const { id } = req.params;
    const habit = await updateHabit(id, req.userId, req.body);

    if (!habit) {
      res.status(404).json({
        message: "Habit not found",
      });
      return;
    }

    res.status(200).json({
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to update habit",
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }
    const { id } = req.params; //get the habit id from url params
    const habit = await deleteHabit(id, req.userId);

    if (!habit) {
      res.status(404).json({
        message: "Habit not found",
      });
      return;
    }

    res.status(200).json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete habit",
    });
  }
}
