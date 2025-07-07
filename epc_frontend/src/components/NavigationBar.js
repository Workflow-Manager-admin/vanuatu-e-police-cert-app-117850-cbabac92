import React from "react";

// PUBLIC_INTERFACE
function NavigationBar({ user, onLogout }) {
  /**
   * Modern minimal NavigationBar: brand left, nav/actions right, with contextual menus (dashboard, apply, status, admin, etc)
   */
  return (
    <nav
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 54,
        padding: "0.7rem 1.8rem 0.7rem 1rem",
        background: "var(--bg-nav,#fff)",
        boxShadow: "0 1px 8px #222e4520",
        borderBottom: "1.5px solid var(--border-color,#e4e8ef)",
        position: "relative",
        zIndex: 21,
      }}
    >
      <span style={{
        fontWeight: 800,
        fontSize: "1.3rem",
        letterSpacing: "-0.5px",
        color: "var(--secondary,#222e45)",
        display: "flex",
        alignItems: "center",
      }}>
        <span style={{
          color: "var(--primary,#1366d6)",
          fontWeight: 700,
          fontSize: "1.1em",
          letterSpacing: "-1px",
          marginRight: 6
        }}>Vanuatu</span>
        <span style={{color: "var(--accent,#27ae60)", fontWeight: 700}}>EPC</span>
        <span style={{
          fontWeight: 500,
          color: "#666",
          marginLeft: 12,
          fontSize: "0.96em",
        }}>Police Certificate</span>
      </span>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
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
          <button style={logoutBtnStyle} onClick={onLogout} aria-label="Logout">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const navLinkStyle = {
  color: "var(--primary,#1366d6)",
  textDecoration: "none",
  fontWeight: 600,
  background: "none",
  border: "none",
  fontSize: "1.05rem",
  letterSpacing: 0,
  opacity: 0.91,
  transition: "opacity 0.18s, color 0.18s",
  padding: "3px 11px",
  borderRadius: "6px",
  display: "inline-block",
};
navLinkStyle['hover'] = {
  opacity: 1,
  textDecoration: "underline",
  background: "#eee"
};

const logoutBtnStyle = {
  background: "var(--accent,#27ae60)",
  border: "none",
  color: "#fff",
  borderRadius: "6px",
  padding: "7px 18px",
  fontWeight: 700,
  fontSize: "1.02em",
  marginLeft: "6px",
  cursor: "pointer",
  boxShadow: "none",
  letterSpacing: "0.03em",
  transition: "background 0.17s"
};

export default NavigationBar;
