import React from "react";

// PUBLIC_INTERFACE
function Notification({ type, message, onClose }) {
  const colorMap = {
    info: "#1366d6",
    success: "#27ae60",
    error: "#e74c3c",
    warn: "#e5b600"
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        minWidth: "190px",
        padding: "17px 32px 17px 24px",
        borderRadius: 8,
        background: "#fff",
        color: colorMap[type] || "#222e45",
        boxShadow: "0 2px 16px rgba(34,46,69,0.11)",
        borderLeft: "7px solid " + (colorMap[type] || "#222e45"),
        fontWeight: 500,
        zIndex: 1000
      }}
      role="alert"
    >
      <span>{message}</span>
      <button
        style={{
          marginLeft: 16,
          background: "transparent",
          border: "none",
          color: "#1366d6",
          fontSize: "1.2em",
          cursor: "pointer",
          position: "absolute",
          top: 14,
          right: 7
        }}
        aria-label="Close notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default Notification;
