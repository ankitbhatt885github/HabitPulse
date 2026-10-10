import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  color?: string;
  isActive: boolean;
}

interface Completion {
  _id: string;
  completedAt: string;
  date: string;
}

interface Dependency {
  _id: string;
  habit: string;
  dependsOn: {
    _id: string;
    name: string;
  };
}

function HabitDetails() {
  const { id } = useParams();

  const [stats, setStats] = useState<HabitStats | null>(null);

  const [habit, setHabit] = useState<Habit | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [completions, setCompletions] = useState<Completion[]>([]);

  const [dependencies, setDependencies] = useState<Dependency[]>([]);

  const navigate = useNavigate();

  //get the habit and get its stats parallelly so promise.all
  useEffect(() => {
    const fetchHabitDetails = async () => {
      if (!id) return;

      try {
        setError("");

        const [habitData, statsData, completionsData, dependenciesData] = await Promise.all([
          apiRequest(`/habits/${id}`),
          apiRequest(`/dashboard/habits/${id}/stats`),
          apiRequest(`/habits/${id}/completions`),
          apiRequest(`/habits/${id}/dependencies`),
        ]);

        setHabit(habitData.habit);
        setStats(statsData.stats);
        setCompletions(completionsData.completions);
        setDependencies(dependenciesData.dependencies);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load habit",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabitDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading habit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={() => navigate("/habits")}
        className="mb-6 rounded-md border px-4 py-2"
      >
        ← Back to Habits
      </button>
      <div>
        <h1 className="text-3xl font-bold">{habit?.name}</h1>

        {habit?.description && (
          <p className="text-gray-500 mt-2">{habit.description}</p>
        )}

        <p className="text-sm text-gray-400 mt-2">{habit?.frequency}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Total Completions</p>

          <p className="text-3xl font-bold mt-2">{stats?.totalCompletions}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Current Streak</p>

          <p className="text-3xl font-bold mt-2">🔥 {stats?.currentStreak}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Longest Streak</p>

          <p className="text-3xl font-bold mt-2">🏆 {stats?.longestStreak}</p>
        </div>

        <div className="border rounded-lg p-5">
          <p className="text-gray-500">Completion Rate</p>

          <p className="text-3xl font-bold mt-2">{stats?.completionRate}%</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Completion History</h2>

        {completions.length === 0 ? (
          <p className="text-gray-500">No completions yet.</p>
        ) : (
          <div className="space-y-3">
            {completions.map((completion) => (
              <div
                key={completion._id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{completion.date}</p>

                  <p className="text-sm text-gray-400">Completed</p>
                </div>

                <span className="text-green-600">✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Dependencies
  </h2>

  {dependencies.length === 0 ? (
    <p className="text-gray-500">
      This habit has no dependencies.
    </p>
  ) : (
    <div className="space-y-3">
      {dependencies.map((dependency) => (
        <div
          key={dependency._id}
          className="border rounded-lg p-4"
        >
          <p className="text-sm text-gray-500">
            Depends on
          </p>

          <p className="font-semibold mt-1">
            {dependency.dependsOn.name}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}

export default HabitDetails;
