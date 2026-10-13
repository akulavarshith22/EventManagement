import { useState } from "react";
import { loginUser, registerUser } from "./services/api";
import "./App.css";

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (mode === "register") {
      if (name.trim().length === 0) {
        setError("Please enter your name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (password.length < 8 || password.length > 72) {
        setError("Password must be between 8 and 72 characters.");
        return;
      }

      if (new TextEncoder().encode(password).length > 72) {
        setError("Password must not exceed 72 bytes.");
        return;
      }
    }

    setLoading(true);

    try {
      const result =
        mode === "register"
          ? await registerUser(name.trim(), cleanEmail, password)
          : await loginUser(cleanEmail, password);

      setPassword("");
      setConfirmPassword("");
      onAuthenticated(result);
    } catch (err) {
      setError(
        err.message || "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <a className="logo auth-logo" href="#auth">
          EventEase<span>.</span>
        </a>

        <div className="auth-visual-content">
          <span className="eyebrow">YOUR NEXT EXPERIENCE STARTS HERE</span>
          <h1>
            Great events.
            <br />
            <span>Unforgettable memories.</span>
          </h1>
          <p>
            Discover events, connect with people, and bring your
            ideas to life with EventEase.
          </p>

          <div className="auth-artwork" aria-hidden="true">
            <span>🎵</span>
            <span>🎨</span>
            <span>💡</span>
            <span>🎉</span>
            <div>✦</div>
          </div>
        </div>

        <p className="auth-footer-note">
          Your events. Your experiences. All in one place.
        </p>
      </section>

      <section className="auth-panel" id="auth">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "auth-tab active" : "auth-tab"}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>

            <button
              type="button"
              className={
                mode === "register" ? "auth-tab active" : "auth-tab"
              }
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">
              {mode === "login" ? "WELCOME BACK" : "JOIN EVENTEASE"}
            </span>

            <h2>
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Enter your details to manage your events."
                : "Get started by creating your free account."}
            </p>
          </div>

          {error && (
            <div className="notice error-notice" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                />
              </label>
            )}

            <label>
              Email address
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={190}
                required
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  placeholder={
                    mode === "register"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={mode === "register" ? 8 : undefined}
                  maxLength={72}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {mode === "register" && (
              <label>
                Confirm password
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  maxLength={72}
                  required
                />
              </label>
            )}

            {mode === "register" && (
              <p className="password-hint">
                Use at least 8 characters. Never reuse an important
                password from another account.
              </p>
            )}

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>

          <p className="auth-security-note">
            <span>🔒</span> Passwords are securely hashed on the server.
          </p>
        </div>
      </section>
    </main>
  );
}