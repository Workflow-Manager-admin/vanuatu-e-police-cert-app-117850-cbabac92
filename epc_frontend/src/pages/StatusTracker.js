import React, { useState, useEffect } from "react";
import { getApplicationStatus } from "../api";
import Notification from "../components/Notification";

// PUBLIC_INTERFACE
function StatusTracker({ token }) {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    setLoading(true);
    getApplicationStatus({ token })
      .then(setStatusData)
      .catch((err) => setNotif({ type: "error", message: err.message }))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="center-container">
        <div className="alert-message">
          Please login and submit an application before tracking status.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="center-container" style={{minHeight: 220, fontSize: "1.2em"}}>Loading status...</div>
    );
  }

  if (!statusData) {
    return (
      <div className="center-container">
        <div className="alert-message">
          No application found. Please submit your police certificate application.
        </div>
      </div>
    );
  }

  return (
    <div className="center-container">
      <div className="main-form" style={{ maxWidth: 430 }}>
        <h2 style={{marginBottom: 16}}>
          Status: <span style={{
            color: statusData.status === "approved" ? "var(--accent,#27ae60)" :
                   statusData.status === "rejected" ? "#e74c3c" :
                   "#1366d6",
            textTransform: "capitalize"
          }}>
            {statusData.status.replace("_", " ")}
          </span>
        </h2>
        <div style={{ margin: "8px 0", color: "#222", opacity: 0.83 }}>
          {statusData.label}
        </div>
        {statusData.status === "approved" && statusData.certUrl && (
          <a
            href={statusData.certUrl}
            className="btn-primary"
            download
            style={{ marginTop: 18 }}
            target="_blank" rel="noopener noreferrer"
          >
            Download Certificate
          </a>
        )}
        {statusData.status === "rejected" && statusData.notes && (
          <div style={{ color: "#e74c3c", marginTop: 14 }}>
            <b>Reason:</b> {statusData.notes}
          </div>
        )}
      </div>
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

export default StatusTracker;
