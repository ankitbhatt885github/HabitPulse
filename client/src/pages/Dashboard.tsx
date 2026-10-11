import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { DashboardData } from "../types/dashboard";
import { useState, useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setError("");
        const data = await apiRequest("/dashboard");

        setDashboard(data.dashboard);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const handleToggleCompletion = async (
    habitId: string,
    completedToday: boolean,
  ) => {
    try {
      await apiRequest(`/habits/${habitId}/complete`, {
        method: completedToday ? "DELETE" : "POST",
      });

      // Refresh dashboard after completion changes
      const data = await apiRequest("/dashboard");
      setDashboard(data.dashboard);
    } catch (error) {
      console.error("Failed to update habit completion:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
    Welcome, {user?.name} 👋
  </h1>
  <p className="mt-2 text-gray-500">
    Here's your progress for today.
  </p>
</div>
        
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Total Habits</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{dashboard?.totalHabits}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Completed Today</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{dashboard?.completedToday}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Completion Rate</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {dashboard?.completionRate}%
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">
  Today's Habits
</h2>

        {dashboard?.habits.length === 0 ? (
          <p className="text-gray-500">You don't have any habits yet.</p>
        ) : (
          <div className="space-y-3">
            {dashboard?.habits.map((habit) => (
              <div
                key={habit._id}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{habit.name}</h3>

                  {habit.description && (
                    <p className="mt-1 text-sm text-gray-500">{habit.description}</p>
                  )}

                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
  {habit.frequency}
</p>
                </div>

                <button
                  onClick={() =>
                    handleToggleCompletion(habit._id, habit.completedToday)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
  habit.completedToday
    ? "bg-green-50 text-green-700 hover:bg-green-100"
    : "bg-indigo-600 text-white hover:bg-indigo-700"
}`}
                >
                  {habit.completedToday ? "✓ Completed" : "Complete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
