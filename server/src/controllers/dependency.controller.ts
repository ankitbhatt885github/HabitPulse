import { Request, Response } from "express";
import { createDependency, getDependencies, deleteDependency } from "../services/dependency.service.js";

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

export async function getAll(
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

    const { id } = req.params;

    const dependencies = await getDependencies(
      id,
      req.userId
    );

    res.status(200).json({
      dependencies,
    });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch dependencies",
    });
  }
};

export async function remove(
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

    const { id, dependencyId } = req.params;

    const dependency = await deleteDependency(
      id,
      dependencyId,
      req.userId
    );

    if (!dependency) {
      res.status(404).json({
        message: "Dependency not found",
      });
      return;
    }

    res.status(200).json({
      message: "Dependency deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete dependency",
    });
  }
};