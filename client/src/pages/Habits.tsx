import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";

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

  //holds id of the habit we are editing/updating
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFrequency, setEditFrequency] = useState<"daily" | "weekly">(
    "daily",
  );
  const [editColor, setEditColor] = useState("#6366F1");

  const navigate = useNavigate();

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

  // Start editing a habit, basically just grab all details of the habit we are
  //going to update
  const handleStartEditing = (habit: Habit) => {
    //grab the habit id of that card/habit
    setEditingHabitId(habit._id);

    //put all the existing data into the edit form
    setEditName(habit.name);
    setEditDescription(habit.description || "");
    setEditFrequency(habit.frequency);
    setEditColor(habit.color || "#6366F1");

    setError("");
  };

  // Update habit
  const handleUpdateHabit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingHabitId) return;

    try {
      setError("");

      const data = await apiRequest(`/habits/${editingHabitId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          frequency: editFrequency,
          color: editColor,
        }),
      });

      //go through all habits and only replace the edited one with updated habit
      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit._id === editingHabitId ? data.habit : habit,
        ),
      );

      setEditingHabitId(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update habit",
      );
    }
  };

  async function handleDeleteHabit(habitId: string) {
    try {
      setError("");

      await apiRequest(`/habits/${habitId}`, {
        method: "DELETE",
      });

      setHabits((currentHabits) =>
        currentHabits.filter((habit) => habit._id !== habitId),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete habit",
      );
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
            <div key={habit._id}>
              {editingHabitId === habit._id ? (
                /* Edit Form */
                /* if editing is being done show edit form else show habit card */
                <form
                  onSubmit={handleUpdateHabit}
                  className="border rounded-lg p-6 space-y-4"
                >
                  <h2 className="text-xl font-semibold">Edit Habit</h2>

                  <input
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="w-full border rounded-md p-2"
                    required
                  />

                  <textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    className="w-full border rounded-md p-2"
                  />

                  <select
                    value={editFrequency}
                    onChange={(event) =>
                      setEditFrequency(event.target.value as "daily" | "weekly")
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
                      value={editColor}
                      onChange={(event) => setEditColor(event.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-md bg-black px-4 py-2 text-white"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingHabitId(null)}
                      className="rounded-md border px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Habit Card */
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">{habit.name}</h2>

                      {habit.description && (
                        <p className="text-gray-500 mt-1">
                          {habit.description}
                        </p>
                      )}

                      <p className="text-sm text-gray-400 mt-2">
                        {habit.frequency}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={
                          habit.isActive ? "text-green-600" : "text-gray-400"
                        }
                      >
                        {habit.isActive ? "Active" : "Inactive"}
                      </span>

                      <button
  onClick={() =>
    navigate(`/habits/${habit._id}`)
  }
  className="rounded-md border px-3 py-1"
>
  Details
</button>

                      <button
                        onClick={() => handleStartEditing(habit)}
                        className="rounded-md border px-3 py-1"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteHabit(habit._id)}
                        className="rounded-md border px-3 py-1 text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Habits;
