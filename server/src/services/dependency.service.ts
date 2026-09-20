import Habit from "../models/habit.model.js";
import HabitDependency from "../models/habitDependency.model.js";

export async function createDependency(
  habitId: string,
  dependsOnId: string,
  userId: string,
) {

    //verify that both habits belong to logged in user
  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  const dependsOnHabit = await Habit.findOne({
    _id: dependsOnId,
    user: userId,
  });

  if (!habit || !dependsOnHabit) {
    throw new Error("Habit not found");
  }

  if (habitId === dependsOnId) {
    throw new Error("A habit cannot depend on itself");
  }

  const dependency = await HabitDependency.create({
    user: userId,
    habit: habitId,
    dependsOn: dependsOnId,
  });

  return dependency;
}
