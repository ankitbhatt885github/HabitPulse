import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  color?: string;
  isActive: boolean;
}

function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [color, setColor] = useState("#6366F1");

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const data = await apiRequest("/habits");

        setHabits(data.habits);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load habits",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabits();
  }, []);

  async function handleCreateHabit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setIsCreating(true);
      setError("");

      const data = await apiRequest("/habits", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          frequency,
          color,
        }),
      });

      setHabits((currentHabits) => [data.habit, ...currentHabits]);

      setName("");
      setDescription("");
      setFrequency("daily");
      setColor("#6366F1");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create habit",
      );
    } finally {
      setIsCreating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading habits...</p>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Habits</h1>

          <p className="text-gray-500 mt-2">Manage your habits</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          + Create Habit
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateHabit}
          className="border rounded-lg p-6 mb-8 space-y-4"
        >
          <h2 className="text-xl font-semibold">Create Habit</h2>

          <input
            type="text"
            placeholder="Habit name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border rounded-md p-2"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full border rounded-md p-2"
          />

          <select
            value={frequency}
            onChange={(event) =>
              setFrequency(event.target.value as "daily" | "weekly")
            }
            className="w-full border rounded-md p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>

          <div>
            <label className="block mb-1">Color</label>

            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              {isCreating ? "Creating..." : "Create Habit"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <p className="text-gray-500">You don't have any habits yet.</p>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{habit.name}</h2>

                  {habit.description && (
                    <p className="text-gray-500 mt-1">{habit.description}</p>
                  )}

                  <p className="text-sm text-gray-400 mt-2">
                    {habit.frequency}
                  </p>
                </div>

                <span
                  className={
                    habit.isActive ? "text-green-600" : "text-gray-400"
                  }
                >
                  {habit.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Habits;
