import { z } from "zod";

//trim means no inital spaces 
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const createHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Habit name is required")
    .max(100, "Habit name must be at most 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  frequency: z.enum(["daily", "weekly"]),

  color: z
    .string()
    .optional(),
});

export const updateHabitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Habit name is required")
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  frequency: z
    .enum(["daily", "weekly"])
    .optional(),

  color: z
    .string()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const dependencySchema = z.object({
  dependsOn: z
    .string()
    .min(1, "dependsOn is required"),
});