import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, logout, signup, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isSignup, setIsSignup] = useState(false);

  if (user) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 pt-20">
        <p className="text-lg">
          Signed in as <strong>{user.email}</strong>
        </p>
        <button
          className="
            w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white
            hover:bg-red-700
          "
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Log out
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-20">
      <h1 className="text-center text-2xl font-bold">
        {isSignup ? "Create Account" : "Log In"}
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="
            rounded-lg border border-white/20 bg-white/5 px-4 py-2
            focus:border-blue-500 focus:outline-none
          "
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <input
          className="
            rounded-lg border border-white/20 bg-white/5 px-4 py-2
            focus:border-blue-500 focus:outline-none
          "
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          type="password"
          value={password}
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          className="
            rounded-lg bg-blue-600 px-4 py-2 font-medium text-white
            hover:bg-blue-700
          "
          type="submit"
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-white/50">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="text-blue-400 underline"
          onClick={() => {
            setIsSignup(!isSignup);
            setError(null);
          }}
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
