import React from "react";

// PUBLIC_INTERFACE
function ApplicantDashboard({ user }) {
  return (
    <div className="dash-container">
      <h2 style={{color: "var(--primary, #1366d6)"}}>Welcome, {user?.name || "Applicant"}!</h2>
      <div style={{
        maxWidth: 540, margin: "1rem auto", background: "#fff",
        borderRadius: 12, boxShadow: "0 1px 8px #d2dbec33", padding: "1.7rem"
      }}>
        <h3 style={{marginTop: 0, marginBottom: 10}}>Your Actions</h3>
        <ul style={{lineHeight: 2}}>
          <li><a href="/apply" className="muted-link">Apply for Police Certificate</a></li>
          <li><a href="/status" className="muted-link">Track Application Status</a></li>
        </ul>
        <div style={{
          fontSize: 14, marginTop: 22, color: "#888"
        }}>
          Get started by clicking one of the actions above.
        </div>
      </div>
    </div>
  );
}

export default ApplicantDashboard;
