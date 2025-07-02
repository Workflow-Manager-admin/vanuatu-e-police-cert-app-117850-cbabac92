//
// Core API utility – Mocked endpoints with basic logic. Real backend API integration to be swapped later.
//

const API_BASE = '/api'; // Placeholder – replace with deployed backend API endpoint

// Simulate an async backend call
const fakeWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// PUBLIC_INTERFACE
export async function loginUser({ email, password }) {
  /** Login endpoint (mock) */
  await fakeWait(700);
  if (email === "admin@vanuatu.gov" && password === "admin123") {
    return { token: "fake-admin-token", role: "admin", name: "Admin Officer" };
  } else if (email.endsWith("@example.com")) {
    return { token: "fake-user-token", role: "applicant", name: "Test User" };
  } else {
    throw new Error("Invalid credentials");
  }
}

// PUBLIC_INTERFACE
export async function registerUser({ name, email, password }) {
  /** Registration endpoint (mock) */
  await fakeWait(600);
  if (!/.+@.+\..+/.test(email)) throw new Error("Invalid email address");
  if (password.length < 6) throw new Error("Password too short");
  return { token: "fake-user-token", role: "applicant", name };
}

// PUBLIC_INTERFACE
export async function submitCertificateApplication({ token, form }) {
  /** Certificate application endpoint (mock) */
  await fakeWait(1000);
  if (!token) throw new Error("Not authenticated");
  return { applicationId: "EPC2024-" + Math.floor(Math.random() * 10000), status: "submitted" };
}

// PUBLIC_INTERFACE
export async function getApplicationStatus({ token }) {
  /** Application status tracking endpoint (mock) */
  await fakeWait(500);
  if (!token) throw new Error("Not authenticated");
  // Simulate random status change
  const statuses = [
    { status: "submitted", label: "Application submitted" },
    { status: "in_review", label: "In police review" },
    { status: "approved", label: "Approved, ready for download" },
    { status: "rejected", label: "Rejected - see notes" }
  ];
  const idx = Math.floor(Math.random() * statuses.length);
  return { ...statuses[idx], certUrl: idx === 2 ? "/certificates/sample.pdf" : null, notes: idx === 3 ? "Missing document." : null };
}

// PUBLIC_INTERFACE
export async function getApplicationsForAdmin({ token }) {
  /** Admin: fetch applications to process (mock) */
  await fakeWait(500);
  if (token !== "fake-admin-token") throw new Error("Not authorized");
  return [
    { id: "EPC2024-1023", applicant: "Alice David", status: "submitted", date: "2024-05-18" },
    { id: "EPC2024-1044", applicant: "Bob Willie", status: "in_review", date: "2024-05-20" }
  ];
}

// PUBLIC_INTERFACE
export async function processApplication({ token, appId, approve = false }) {
  /** Admin: approve or reject application (mock) */
  await fakeWait(700);
  if (token !== "fake-admin-token") throw new Error("Not authorized");
  return { ok: true, status: approve ? "approved" : "rejected" };
}
