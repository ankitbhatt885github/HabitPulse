import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import { setUser } from "../store/authSlice";
import { apiRequest } from "../services/api";
import { Link } from "react-router-dom";

function Register() {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [name,setName] = useState("");
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>){
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try{
        //make/send req from frontend for register
        const data = await apiRequest("/auth/register",{
            method: "POST",
            body: JSON.stringify({
                name,
          email,
          password,
            })
        })

        dispatch(setUser(data.user));

      navigate("/dashboard");

    } catch(error){
        setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">
          Create your HabitPulse account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block mb-1"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full border rounded-md p-2"
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-black text-white p-2 disabled:opacity-50"
          >
            {isLoading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center">
  Already have an account?{" "}
  <Link
    to="/login"
    className="underline"
  >
    Login
  </Link>
</p>
      </div>
    </div>
  );
}

export default Register;