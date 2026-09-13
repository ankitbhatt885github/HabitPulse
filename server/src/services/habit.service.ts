import Habit, { HabitFrequency } from "../models/habit.model.js";

interface CreateHabitData {
  userId: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  color?: string;
}

export async function createHabit(
  data: CreateHabitData
) {
  const { userId, name, description, frequency, color } = data;

  const habit = await Habit.create({
    user: userId,
    name,
    description,
    frequency,
    color,
  });

  return habit;
}