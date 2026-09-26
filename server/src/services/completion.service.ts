import HabitCompletion from "../models/habitCompletion.model.js";
import Habit from "../models/habit.model.js";
import { getTodayDate } from "../utils/date.js";
import redis from "../config/redis.js";

export async function completeHabit(habitId: string, userId: string) {
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  //split date into year-month-date format
  const today = getTodayDate();

  const completion = await HabitCompletion.create({
    habit: habitId,
    user: userId,
    date: today,
  });

  // Clear dashboard cache because completion changed
  await redis.del(`dashboard:${userId}`);

  return completion;
}

export async function getHabitCompletions(habitId: string, userId: string) {
  //find habit completions for specific habit belonging to the user
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  //find is there a habit

  if (!habit) {
    throw new Error("Habit not found");
  }

  const completions = await HabitCompletion.find({
    habit: habitId,
    user: userId,
  }).sort({
    date: -1,
  });

  return completions;
}

export async function uncompleteHabit(habitId: string, userId: string) {
  const today = getTodayDate();

  const completion = await HabitCompletion.findOneAndDelete({
    habit: habitId,
    user: userId,
    date: today,
  });

  if (completion) {
    // Clear dashboard cache because completion was removed
    await redis.del(`dashboard:${userId}`);
  }

  return completion;
}

export async function getHabitStreak(habitId: string, userId: string) {
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  //find the completions
  const completions = await HabitCompletion.find({
    habit: habitId,
    user: userId,
  }).sort({
    date: -1,
  });

  //put completions in Set
  const completionDates = new Set(
    completions.map((completion) => completion.date),
  );

  const currentDate = new Date();
  let currentStreak = 0;


  //find current streak
  while (true) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const dateString = `${year}-${month}-${day}`;

    if (!completionDates.has(dateString)) {
      break;
    }

    currentStreak++;

    currentDate.setDate(currentDate.getDate() - 1);
  }

  let longestStreak = 0;
  let runningStreak = 0;

  //array of string of sorted dates
  const sortedDates = completions.map((completion) => completion.date).sort();

  //find longest streak, i is each date one by one from array of strings
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      runningStreak = 1;
    } else {
      const previousDate = new Date(sortedDates[i - 1]);
      const currentDate = new Date(sortedDates[i]);

      const difference =
        (currentDate.getTime() - previousDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, runningStreak);
  }

  return {
    currentStreak,
    longestStreak,
    totalCompletions: completions.length,
  };
}
