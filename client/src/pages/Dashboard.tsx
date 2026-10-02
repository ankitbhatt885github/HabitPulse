import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import { clearUser } from "../store/authSlice";
import { apiRequest } from "../services/api";

function Dashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(
        (state: RootState) => state.auth.user
    )

    async function handleLogout(){
        try{
            await apiRequest("/auth/logout",{
                method: "POST",
            })

            dispatch(clearUser());
            navigate("/login");

        } catch{
            console.error("Logout failed:", error);

        }
    }

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            HabitPulse
          </h1>

          <p className="mt-2">
            Welcome, {user?.name} 👋
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;