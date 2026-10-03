import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import { clearUser } from "../store/authSlice";
import { apiRequest } from "../services/api";
import type { DashboardData } from "../types/dashboard";
import { useState, useEffect } from "react";

function Dashboard() {
  const dispatch = useDispatch();
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

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });

      dispatch(clearUser());
      navigate("/login");
    } catch {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HabitPulse</h1>

          <p className="mt-2">Welcome, {user?.name} 👋</p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Total Habits</p>

          <p className="text-3xl font-bold mt-2">{dashboard?.totalHabits}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Completed Today</p>

          <p className="text-3xl font-bold mt-2">{dashboard?.completedToday}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Completion Rate</p>

          <p className="text-3xl font-bold mt-2">
            {dashboard?.completionRate}%
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Habits</h2>

        {dashboard?.habits.length === 0 ? (
          <p className="text-gray-500">You don't have any habits yet.</p>
        ) : (
          <div className="space-y-3">
            {dashboard?.habits.map((habit) => (
              <div
                key={habit._id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{habit.name}</h3>

                  {habit.description && (
                    <p className="text-gray-500 mt-1">{habit.description}</p>
                  )}

                  <p className="text-sm text-gray-400 mt-2">
                    {habit.frequency}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleToggleCompletion(habit._id, habit.completedToday)
                  }
                  className="rounded-md border px-4 py-2"
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
