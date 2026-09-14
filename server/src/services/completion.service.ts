import HabitCompletion from "../models/habitCompletion.model.js";
import Habit from "../models/habit.model.js";

export async function completeHabit(habitId: string, userId: string) {
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  //split date into year-month-date format
  const today = new Date().toISOString().split("T")[0];

  const completion = await HabitCompletion.create({
    habit: habitId,
    user: userId,
    date: today,
  });

  return completion;
}
