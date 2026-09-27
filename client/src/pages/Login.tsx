import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import { setUser } from "../store/authSlice";
import { apiRequest } from "../services/api";



function Login() {

    const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>){

        event.preventDefault();
        setError("");
    setIsLoading(true);

    try{
        //make the api call using api helper function from api.ts, we send the
        // email and pass to backend
        const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      //put the user in our redux store!!!
      dispatch(setUser(data.user));
      //move to dashboard screen
      navigate("/dashboard");
    } catch(error){
        setError(
            error instanceof Error
          ? error.message
          : "Login failed"
        )
    } finally{
        setIsLoading(false)
    }
    }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 text-3xl font-bold mb-6>Login to HabitPulse</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1" htmlFor="email">Email</label>
                <input id="email"
              type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border rounded-md p-2" required />
            </div>

            <div>
                <label className="block mb-1" htmlFor="password">Password</label>
                <input id="password" type="password" value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              } className="w-full border rounded-md p-2" required />
            </div>

            {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

            <button className="w-full rounded-md bg-black text-white p-2 disabled:opacity-50">
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
      </div>
    </div>
  );
}

export default Login;