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

  //for dependency
  const [allHabits, setAllHabits] = useState<Habit[]>([]);

  const [selectedHabitId, setSelectedHabitId] = useState("");

  const [isAddingDependency, setIsAddingDependency] = useState(false);

  //get the habit and get its stats parallelly so promise.all
  useEffect(() => {
    const fetchHabitDetails = async () => {
      if (!id) return;

      try {
        setError("");

        const [
          habitData,
          statsData,
          completionsData,
          dependenciesData,
          habitsData,
        ] = await Promise.all([
          apiRequest(`/habits/${id}`),
          apiRequest(`/dashboard/habits/${id}/stats`),
          apiRequest(`/habits/${id}/completions`),
          apiRequest(`/habits/${id}/dependencies`),
          apiRequest("/habits"),
        ]);

        setHabit(habitData.habit);
        setStats(statsData.stats);
        setCompletions(completionsData.completions);
        setDependencies(dependenciesData.dependencies);
        setAllHabits(habitsData.habits);
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


  //add a dependency
  const handleAddDependency = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id || !selectedHabitId) return;

    try {
      setIsAddingDependency(true);
      setError("");

      await apiRequest(`/habits/${id}/dependencies`, {
        method: "POST",
        body: JSON.stringify({
          dependsOn: selectedHabitId,
        }),
      });

      // Fetch dependencies with populated habit details
      const data = await apiRequest(`/habits/${id}/dependencies`);

      setDependencies(data.dependencies);
      setSelectedHabitId("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add dependency",
      );
    } finally {
      setIsAddingDependency(false);
    }
  };

  //delete dependency
  const handleRemoveDependency = async (dependencyId: string) => {
    if (!id) return;

    try {
      setError("");

      await apiRequest(`/habits/${id}/dependencies/${dependencyId}`, {
        method: "DELETE",
      });

      setDependencies((currentDependencies) =>
        currentDependencies.filter(
          (dependency) => dependency._id !== dependencyId,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove dependency",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading habit...</p>
      </div>
    );
  }

  {error && (
  <p
    role="alert"
    className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700"
  >
    {error}
  </p>
)}

  return (
    <div className="space-y-8">
      <button
  type="button"
  onClick={() => navigate("/habits")}
  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-gray-500">Total Completions</p>

          <p className="text-3xl font-bold mt-2">{stats?.totalCompletions}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-gray-500">Current Streak</p>

          <p className="text-3xl font-bold mt-2">🔥 {stats?.currentStreak}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-gray-500">Longest Streak</p>

          <p className="text-3xl font-bold mt-2">🏆 {stats?.longestStreak}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
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
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
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
        <h2 className="text-2xl font-bold mb-4">Dependencies</h2>

        <form onSubmit={handleAddDependency} className="flex gap-3 mb-6">
          <select
            value={selectedHabitId}
            onChange={(event) => setSelectedHabitId(event.target.value)}
            className="flex-1 border rounded-md p-2"
            required
          >
            <option value="">Select a habit</option>

            {allHabits
              .filter((item) => item._id !== id)
              .map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
          </select>

          <button
            type="submit"
            disabled={isAddingDependency}
            className="rounded-md bg-yellow-600 px-4 py-2 text-gray-950 hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAddingDependency ? "Adding..." : "Add Dependency"}
          </button>
        </form>

        {dependencies.length === 0 ? (
          <p className="text-gray-500">This habit has no dependencies.</p>
        ) : (
          <div className="space-y-3">
            {dependencies.map((dependency) => (
              
                <div
                  key={dependency._id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="text-sm text-gray-500">Depends on</p>

                    <p className="font-semibold mt-1">
                      {dependency.dependsOn.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDependency(dependency._id)}
                    className="rounded-md border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitDetails;
