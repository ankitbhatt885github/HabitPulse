import mongoose, { Document, Schema } from "mongoose";
export type HabitFrequency = "daily" | "weekly";

export interface IHabit extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  color?: string;
  isActive: boolean;
}

const habitSchema = new Schema<IHabit>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      required: true,
      default: "daily",
    },

    color: {
      type: String,
      default: "#6366F1",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.model<IHabit>("Habit", habitSchema);
export default Habit;
