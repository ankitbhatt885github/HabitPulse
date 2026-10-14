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

  //to display error with fetching is facing some issues
  const [actionError, setActionError] = useState("");

  //to disable btn of that habit whose api call is being made to fetch its details
  // so that no extra calls are made, store its id in this variable
  const [updatingHabitId, setUpdatingHabitId] = useState<string | null>(null);

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

  if (isLoading) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-gray-500">Loading your dashboard...</p>
    </div>
  );
}

  const handleToggleCompletion = async (
    habitId: string,
    completedToday: boolean,
  ) => {
    try {
      setUpdatingHabitId(habitId);
      setActionError("");

      await apiRequest(`/habits/${habitId}/complete`, {
        method: completedToday ? "DELETE" : "POST",
      });

      const data = await apiRequest("/dashboard");
      setDashboard(data.dashboard);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update habit completion",
      );
    } finally {
      setUpdatingHabitId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome, {user?.name} 👋
          </h1>
          <p className="mt-2 text-gray-500">Here's your progress for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Total Habits</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {dashboard?.totalHabits}
          </p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Completed Today</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {dashboard?.completedToday}
          </p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Completion Rate</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {dashboard?.completionRate}%
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full border border-slate-600 bg-gray-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, dashboard?.completionRate ?? 0))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-4">
          Today's Habits
        </h2>

        {dashboard?.habits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <h3 className="font-semibold text-gray-900">No habits yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first habit and start building a routine.
            </p>

            <button
              type="button"
              onClick={() => navigate("/habits")}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create your first habit
            </button>
          </div>
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
                    <p className="mt-1 text-sm text-gray-500">
                      {habit.description}
                    </p>
                  )}

                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    {habit.frequency}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={updatingHabitId === habit._id}
                  onClick={() =>
                    handleToggleCompletion(habit._id, habit.completedToday)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    habit.completedToday
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {updatingHabitId === habit._id
                    ? "Updating..."
                    : habit.completedToday
                      ? "✓ Completed"
                      : "Complete"}
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
