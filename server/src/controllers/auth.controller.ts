import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.js";

export async function register (req:Request, res:Response): Promise<void> {

    try{
        const {name, email, password} = req.body;
        //send it to registerUser() service function
        const user = await registerUser({
      name,
      email,
      password,
    });

    //don't return the password. no need
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    } catch(error){
        res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });

    }
}

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};