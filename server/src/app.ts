import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import habitRoutes from "./routes/habit.routes.js";
import completionRoutes from "./routes/completion.routes.js";
import dependencyRoutes from "./routes/dependency.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api", completionRoutes);
app.use("/api", dependencyRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Habit Pulse API is running!",
  });
});

export default app;