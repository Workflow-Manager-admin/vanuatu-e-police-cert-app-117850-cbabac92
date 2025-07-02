import React, { useEffect, useState } from "react";
import { getApplicationsForAdmin, processApplication } from "../api";
import Notification from "../components/Notification";

// PUBLIC_INTERFACE
function AdminDashboard({ token }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    setLoading(true);
    getApplicationsForAdmin({ token })
      .then(setApps)
      .catch(err => setNotif({ type: "error", message: err.message }))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAction(appId, approve) {
    try {
      await processApplication({ token, appId, approve });
      setNotif({
        type: "success",
        message: approve ? "Application approved." : "Application rejected."
      });
      // Remove processed
      setApps(prev => prev.filter(a => a.id !== appId));
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    }
  }

  if (!token) {
    return (
      <div className="center-container">
        <div className="alert-message">
          Please login as admin.
        </div>
      </div>
    );
  }

  return (
    <div className="dash-container">
      <h2 style={{ color: "var(--primary,#1366d6)" }}>Admin Dashboard</h2>
      {loading ? (
        <div style={{ marginTop: 80, fontSize: 20 }}>Loading applications...</div>
      ) : (
        <div style={{marginTop: 18, minHeight: 220}}>
          {apps.length === 0 ? (
            <div style={{ color: "#888", fontSize: 16 }}>No applications to review right now.</div>
          ) : (
            <table className="main-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.applicant}</td>
                    <td>{app.status}</td>
                    <td>{app.date}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-success"
                        style={{ marginRight: 8 }}
                        onClick={() => handleAction(app.id, true)}
                      >Approve</button>
                      <button
                        className="btn-reject"
                        onClick={() => handleAction(app.id, false)}
                      >Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
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

export default AdminDashboard;
