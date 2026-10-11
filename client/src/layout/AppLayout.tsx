import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { clearUser } from "../store/authSlice";
import { apiRequest } from "../services/api";

function AppLayout() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });

      dispatch(clearUser());
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive
        ? "bg-indigo-100 text-indigo-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <NavLink
            to="/dashboard"
            className="text-xl font-bold text-indigo-600"
          >
            HabitPulse
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/dashboard"
              className={linkClass}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/habits"
              className={linkClass}
            >
              Habits
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-600 sm:inline">
              {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;