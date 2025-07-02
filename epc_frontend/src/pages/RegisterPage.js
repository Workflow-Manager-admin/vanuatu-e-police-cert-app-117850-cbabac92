import React, { useState } from "react";
import { registerUser } from "../api";
import Notification from "../components/Notification";

// PUBLIC_INTERFACE
function RegisterPage({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);

  // Handle registration form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setNotif(null);
    if (pw !== pw2) {
      setNotif({ type: "error", message: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const user = await registerUser({ name, email, password: pw });
      onRegister(user);
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    }
    setLoading(false);
  }

  return (
    <div className="center-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          Name
          <input
            required
            minLength={2}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            placeholder="Full Name"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mail address"
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoComplete="new-password"
            placeholder="Password"
            minLength={6}
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            required
            value={pw2}
            onChange={e => setPw2(e.target.value)}
            autoComplete="off"
            placeholder="Re-type password"
            minLength={6}
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <a href="/login" className="muted-link">
            Already have an account? Login
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

export default RegisterPage;
