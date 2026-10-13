
import { useState } from "react";
import AuthPage from "./AuthPage.jsx";
import EventsDashboard from "./EventDashBoard.jsx";
import { setAuthToken } from "./services/api.js";
import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);

  function handleAuthenticated(result) {
    if (!result || !result.token) {
      console.error(
        "Login response is missing the authentication token."
      );
      return;
    }

    setAuthToken(result.token);

    setSession({
      token: result.token,
      name: result.name || "User",
      email: result.email || "",
    });
  }

  function handleLogout() {
    setAuthToken(null);
    setSession(null);
  }

  if (!session) {
    return (
      <AuthPage
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  return (
    <EventsDashboard
      user={session}
      onLogout={handleLogout}
    />
  );
}
