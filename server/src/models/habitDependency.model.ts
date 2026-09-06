import mongoose, { Document, Schema } from "mongoose";

export interface IHabitDependency extends Document {
  user: mongoose.Types.ObjectId;
  habit: mongoose.Types.ObjectId;
  dependsOn: mongoose.Types.ObjectId;
}

const habitDependencySchema = new Schema<IHabitDependency>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    habit: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    dependsOn: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

habitDependencySchema.index(
  { user: 1, habit: 1, dependsOn: 1 },
  { unique: true }
);

const HabitDependency = mongoose.model<IHabitDependency>(
  "HabitDependency",
  habitDependencySchema
);

export default HabitDependency;