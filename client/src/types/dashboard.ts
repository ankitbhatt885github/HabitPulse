export interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  completedToday: boolean;
}

export interface DashboardData {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  habits: Habit[];
}