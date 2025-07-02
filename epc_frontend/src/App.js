import React, { useEffect, useState } from "react";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Notification from "./components/Notification";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import CertificateForm from "./pages/CertificateForm";
import StatusTracker from "./pages/StatusTracker";
import AdminDashboard from "./pages/AdminDashboard";

/**
 * Simple router for path (no dependencies).
 */
function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const h = () => setPath(window.location.pathname);
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);
  // Navigate
  function push(p) {
    window.history.pushState({}, "", p);
    setPath(p);
  }
  return [path, push];
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("epc__user")) || null;
    } catch {
      return null;
    }
  });
  const [notification, setNotification] = useState(null);
  const [path, nav] = usePath();

  // Persist user to localStorage for auth "persistence"
  useEffect(() => {
    if (user) {
      localStorage.setItem("epc__user", JSON.stringify(user));
    } else {
      localStorage.removeItem("epc__user");
    }
  }, [user]);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Set custom brand colors as css vars
    document.documentElement.style.setProperty("--primary", "#1366d6");
    document.documentElement.style.setProperty("--accent", "#27ae60");
    document.documentElement.style.setProperty("--secondary", "#222e45");
  }, [theme]);

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    setUser(null);
    nav("/login");
  }

  // Page resolver (simple)
  let page;
  if (user && user.role === "admin") {
    if (path === "/" || path === "/admin") {
      page = <AdminDashboard token={user.token} />;
    } else if (path === "/dashboard") {
      nav("/admin");
    } else {
      page = (
        <div className="center-container">
          <div className="alert-message">
            Page not found. <a href="/admin">Admin Dashboard</a>
          </div>
        </div>
      );
    }
  } else if (user && user.role === "applicant") {
    if (path === "/" || path === "/dashboard") {
      page = <ApplicantDashboard user={user} />;
    } else if (path === "/apply") {
      page = <CertificateForm token={user.token} />;
    } else if (path === "/status") {
      page = <StatusTracker token={user.token} />;
    } else {
      page = (
        <div className="center-container">
          <div className="alert-message">
            Page not found. <a href="/dashboard">Back to Dashboard</a>
          </div>
        </div>
      );
    }
  } else if (path === "/login") {
    page = (
      <LoginPage
        onLogin={(user) => {
          setUser(user);
          setNotification({ type: "success", message: "Welcome!" });
          // Route per role
          setTimeout(() => nav(user.role === "admin" ? "/admin" : "/dashboard"), 200);
        }}
      />
    );
  } else if (path === "/register") {
    page = (
      <RegisterPage
        onRegister={(user) => {
          setUser(user);
          setNotification({ type: "success", message: "Registration successful!" });
          setTimeout(() => nav("/dashboard"), 200);
        }}
      />
    );
  } else {
    page = (
      <div className="center-container">
        <div className="alert-message">
          Please <a href="/login">login</a> to continue.
        </div>
      </div>
    );
  }

  // Listen for navigation links and hijack to client-side nav
  useEffect(() => {
    function onClick(e) {
      if (
        e.target.tagName === "A" &&
        e.target.href &&
        e.target.href.startsWith(window.location.origin)
      ) {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        nav(href);
      }
    }
    document.body.addEventListener("click", onClick);
    return () => document.body.removeEventListener("click", onClick);
  }, [nav]);

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 0, background: "#f8f9fa" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <NavigationBar user={user} onLogout={handleLogout} />
      </header>
      <main style={{ minHeight: "64vh" }}>{page}</main>
      <footer
        style={{
          fontSize: 13,
          color: "#222e45",
          background: "#e5eef8",
          marginTop: 36,
          padding: "1.8rem 0 0.7rem",
          textAlign: "center",
          opacity: 0.94,
        }}
      >
        <span>
          Vanuatu Police Force &mdash; Pacific Digital Economy Programme &mdash; 2024
        </span>
      </footer>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
