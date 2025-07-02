import React from "react";

// PUBLIC_INTERFACE
function NavigationBar({ user, onLogout }) {
  /** NavigationBar provides top navigation for the app, adapting to user/admin roles */
  return (
    <nav
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.8rem 1.8rem",
        background: "var(--primary, #1366d6)",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(34,46,69,0.03)"
      }}
    >
      <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>
        <span style={{ color: "var(--accent, #27ae60)" }}>Vanuatu</span> Certificate
      </span>
      <div style={{ display: "flex", gap: 20 }}>
        {user && user.role === "applicant" && (
          <>
            <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
            <a href="/apply" style={navLinkStyle}>Apply</a>
            <a href="/status" style={navLinkStyle}>Status</a>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <a href="/admin" style={navLinkStyle}>Admin Dashboard</a>
          </>
        )}
        {!user && (
          <>
            <a href="/login" style={navLinkStyle}>Login</a>
            <a href="/register" style={navLinkStyle}>Register</a>
          </>
        )}
        {user && (
          <button style={logoutBtnStyle} onClick={onLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
  opacity: 0.92,
  transition: "opacity 0.2s",
  fontSize: "1rem"
};

const logoutBtnStyle = {
  background: "var(--accent, #27ae60)",
  border: "none",
  color: "#fff",
  borderRadius: "6px",
  padding: "5px 16px",
  fontWeight: 600,
  fontSize: "1rem",
  marginLeft: "6px",
  cursor: "pointer",
  boxShadow: "none",
};

export default NavigationBar;
