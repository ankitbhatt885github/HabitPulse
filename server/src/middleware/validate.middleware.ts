import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";


//validate recieves a schema
//basically we are using this middleware for different schemas
export const validate = (schema: ZodSchema) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    //get the data that frontend is sending eg- name,email etc from req.body
    //pass it to the schema
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    req.body = result.data;

    next();
  };
};