import Habit from "../models/habit.model.js";
import HabitCompletion from "../models/habitCompletion.model.js";

export async function getDashboard(userId: string) {
  //get currently active habits
  const habits = await Habit.find({
    user: userId,
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  const today = new Date().toISOString().split("T")[0];

  //count of todays completions
  const completedToday = await HabitCompletion.countDocuments({
    user: userId,
    date: today,
  });

  const totalHabits = habits.length;

  //create a completion rate -> completed today/total habits * 100
  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  //return imp info
  return {
    totalHabits,
    completedToday,
    completionRate,
    habits,
  };
}
