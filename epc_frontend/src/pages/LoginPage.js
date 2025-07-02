import React, { useState } from "react";
import { loginUser } from "../api";
import Notification from "../components/Notification";

// PUBLIC_INTERFACE
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);

  // Handle login form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setNotif(null);
    try {
      const user = await loginUser({ email, password: pw });
      onLogin(user);
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    }
    setLoading(false);
  }

  return (
    <div className="center-container">
      <form className="auth-card" onSubmit={handleSubmit} autoComplete="on">
        <h2>Login</h2>
        <label>
          Email
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mail address"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoComplete="current-password"
            placeholder="Password"
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <a href="/register" className="muted-link">
            Don&apos;t have an account? Register
          </a>
        </div>
      </form>
      {notif && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif(null)}
        />
      )}
    </div>
  );
}

export default LoginPage;
