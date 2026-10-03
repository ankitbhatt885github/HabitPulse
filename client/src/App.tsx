import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { setUser } from "./store/authSlice";
import { apiRequest } from "./services/api";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Habits from "./pages/Habits";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await apiRequest("/auth/me");

        dispatch(setUser(data.user));
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [dispatch]);

  //while auth is being checked show this on the UI
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
  path="/habits"
  element={
    <ProtectedRoute>
      <Habits />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
