import { Request, Response } from "express";
import { createDependency } from "../services/dependency.service.js";

export async function create(
  req: Request,
  res: Response
){
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    //habit id from params, here we are creating a dependency for
    const { id } = req.params;
    //this is the dependant habit
    const { dependsOn } = req.body;

    const dependency = await createDependency(
      id,
      dependsOn,
      req.userId
    );

    res.status(201).json({
      message: "Dependency created successfully",
      dependency,
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create dependency",
    });
  }
};