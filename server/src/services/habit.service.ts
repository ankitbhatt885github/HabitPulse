import Habit, { HabitFrequency } from "../models/habit.model.js";

interface CreateHabitData {
  userId: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  color?: string;
}

export async function createHabit(data: CreateHabitData) {
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

export async function getHabits(userId: string) {
  //return habits for the authenticated user with newly created first
  const habits = await Habit.find({ user: userId }).sort({
    createdAt: -1,
  });
  return habits;
}

export async function getHabitById(habitId: string, userId: string) {
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  return habit;
}

interface UpdateHabitData {
  name?: string;
  description?: string;
  frequency?: HabitFrequency;
  color?: string;
  isActive?: boolean;
}

export async function updateHabit(
  habitId: string,
  userId: string,
  data: UpdateHabitData,
) {
  const habit = await Habit.findOneAndUpdate(
    {
      _id: habitId,
      user: userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  );
  return habit;
}

export async function deleteHabit(habitId: string, userId: string) {
    //delete the habit
  const habit = await Habit.findOneAndDelete({
    _id: habitId,
    user: userId,
  });

  return habit;
}
