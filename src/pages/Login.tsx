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
      <div>
        <p>
          Signed in as <strong>{user.email}</strong>
        </p>
        <button
          className="container-fluid"
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
    <div>
      <h1>
        {isSignup ? "Create Account" : "Log In"}
      </h1>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label
            htmlFor="email"
          >Email
            <input
              aria-describedby="valid-helper"
              aria-invalid={
                error !== null ? "true" : undefined
              }
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              value={email}
            />
            {error && (
              <small id="valid-helper">
                {error}
              </small>
            )}
          </label>
          <label
            htmlFor="password"
          >Password
            <input
              aria-describedby="valid-helper"
              aria-invalid={error !== null ? "true" : undefined}
              id="password"
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              type="password"
              value={password}
            />
            {error && (
              <small id="valid-helper">
                {error}
              </small>
            )}
          </label>

          <button type="submit">
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </fieldset>
      </form>

      <p className="container-fluid" style={{ textAlign: "center" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <a
          onClick={() => {
            setIsSignup(!isSignup);
            setError(null);
          }}
        >
          {isSignup ? "Log in" : "Sign up"}
        </a>
      </p>
    </div>
  );
}
