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

export async function getHabitStats(habitId: string, userId: string) {
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  //get all completions
  const completions = await HabitCompletion.find({
    habit: habitId,
    user: userId,
  }).sort({
    date: -1,
  });

  const totalCompletions = completions.length;

  //store only the completion dates and keep as set so that we can easily find date is inside set or not
  const completionDates = new Set(
    completions.map((completion) => completion.date),
  );

  //current streak
  let currentStreak = 0;
  const currentDate = new Date();

  while (true) {
    const dateString = currentDate.toISOString().split("T")[0];

    //if set doesnt have the date break out of loop
    if (!completionDates.has(dateString)) break;

    currentStreak++;

    currentDate.setDate(currentDate.getDate() - 1);
  }

  //longest streak
  //store dates like 12sept, 13 sept.... sorted, from oldest to newest
  const sortedDates = completions.map((completion) => completion.date).sort();

  let longestStreak = 0;
  let runningStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      runningStreak = 1;
    } else {
      //find previous date, basically the date before current
      const previousDate = new Date(sortedDates[i - 1]);

      const currentDate = new Date(sortedDates[i]);

      //if difference between both dates is 1 means they are consecutive
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

  //now completion rate -> total completions/days since creaetion * 100
  const createdAt = new Date(habit.createdAt);
  const today = new Date();

  const daysSinceCreation =
    Math.floor(
      (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;

  const completionRate =
    daysSinceCreation === 0
      ? 0
      : Math.round((totalCompletions / daysSinceCreation) * 100);

  return {
    totalCompletions,
    currentStreak,
    longestStreak,
    completionRate,
  };
}
