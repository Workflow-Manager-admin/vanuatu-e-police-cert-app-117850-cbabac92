import React, { useState } from "react";
import { submitCertificateApplication } from "../api";
import Notification from "../components/Notification";

// PUBLIC_INTERFACE
function CertificateForm({ token }) {
  const [form, setForm] = useState({
    fullname: "", dob: "", nationality: "Vanuatu", address: "", passport: ""
  });
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setNotif(null);
    try {
      await submitCertificateApplication({ token, form });
      setSubmitted(true);
      setNotif({
        type: "success",
        message: "Application submitted! You can track its status."
      });
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="center-container" style={{minHeight: 300}}>
        <h3 style={{marginBottom: 18, color: "var(--primary, #1366d6)"}}>
          Application Submitted
        </h3>
        <span>
          Thank you. Your police certificate application is now being processed.<br /><br />
        </span>
        <a href="/status" className="btn-primary">Track Status</a>
      </div>
    );
  }

  return (
    <div className="center-container" style={{ marginTop: "1.8rem" }}>
      <form className="main-form" onSubmit={handleSubmit}>
        <h2>Apply for Police Certificate</h2>
        <label>
          Full Name
          <input
            name="fullname"
            required
            value={form.fullname}
            onChange={handleChange}
            autoFocus
            placeholder="Full legal name"
            minLength={2}
          />
        </label>
        <label>
          Date of Birth
          <input
            name="dob"
            type="date"
            required
            value={form.dob}
            onChange={handleChange}
            min="1900-01-01"
            max="2025-12-31"
          />
        </label>
        <label>
          Nationality
          <input
            name="nationality"
            value={form.nationality}
            placeholder="Nationality"
            readOnly
          />
        </label>
        <label>
          Residential Address
          <input
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            placeholder="Current address"
            minLength={2}
          />
        </label>
        <label>
          Passport Number
          <input
            name="passport"
            required
            value={form.passport}
            onChange={handleChange}
            placeholder="Passport No."
            minLength={2}
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
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

export default CertificateForm;
