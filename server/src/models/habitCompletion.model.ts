import mongoose, { Document, Schema } from "mongoose";

export interface IHabitCompletion extends Document {
  habit: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  completedAt: Date;
  date: string;
}

const habitCompletionSchema = new Schema<IHabitCompletion>(
  {
    habit: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

habitCompletionSchema.index({ habit: 1, date: 1 }, { unique: true });

const HabitCompletion = mongoose.model<IHabitCompletion>(
  "HabitCompletion",
  habitCompletionSchema,
);

export default HabitCompletion;
