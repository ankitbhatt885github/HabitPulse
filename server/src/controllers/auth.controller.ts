import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;
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
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    //if user is returned successfully then only jwt is generated else
    //catch block would have run here
    const token = generateToken(user._id.toString()); //userId is passed

    //send this jwt to browser as a cookie called token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //cookie is for 7 days (in milliseconds)

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
