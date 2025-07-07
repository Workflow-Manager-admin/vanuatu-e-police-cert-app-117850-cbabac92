//
// Core API utility – Real backend API integration for all EPC user/admin flows.
// Replaces all mock handlers with real fetch-based implementations.
//

const API_BASE = (window._API_BASE || process.env.REACT_APP_API_BASE || "/api").replace(/\/+$/, ""); // Allow env override for base URL

// Utilities
function getAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
function handleUserResponse(data) {
  // Unify backend user auth payload shape
  return {
    token: data.access_token || data.token,
    role: data.is_admin ? "admin" : "applicant",
    name: data.name || data.fullname || data.email || "User"
  };
}

// PUBLIC_INTERFACE
/**
 * Login endpoint – sends credentials to backend, returns user context and token.
 * @param {Object} payload - { email, password }
 * @returns {Promise<{token, role, name}>}
 */
export async function loginUser({ email, password }) {
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ username: email, password })
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.detail || "Login failed.");
  }
  const result = await resp.json();
  // After login, fetch user profile (role etc) for trust
  const me = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      ...getAuthHeaders(result.access_token)
    }
  });
  if (!me.ok) throw new Error("Failed to read user profile.");
  const meData = await me.json();
  return handleUserResponse({ ...result, ...meData });
}

// PUBLIC_INTERFACE
/**
 * Registration endpoint – creates user, returns user context and token.
 * @param {Object} payload - { name, email, password }
 * @returns {Promise<{token, role, name}>}
 */
export async function registerUser({ name, email, password }) {
  const resp = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name, email, password
    })
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.detail || "Unable to register.");
  }
  const result = await resp.json();
  // After registration, fetch user profile (role etc)
  const me = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      ...getAuthHeaders(result.access_token)
    }
  });
  if (!me.ok) throw new Error("Failed to fetch profile after registration");
  const meData = await me.json();
  return handleUserResponse({ ...result, ...meData, name });
}

// PUBLIC_INTERFACE
/**
 * Submits a certificate application for the logged-in user.
 * @param {Object} payload - { token, form:{fullname, dob, nationality, address, passport} }
 * @returns {Promise<{applicationId, status}>}
 */
export async function submitCertificateApplication({ token, form }) {
  if (!token) throw new Error("Not authenticated");
  const resp = await fetch(`${API_BASE}/epc/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token)
    },
    body: JSON.stringify({
      fullname: form.fullname,
      dob: form.dob,
      nationality: form.nationality,
      address: form.address,
      passport: form.passport
    })
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.detail || "Application submission failed");
  }
  const data = await resp.json();
  return {
    applicationId: data.id,
    status: data.status || "submitted"
  };
}

// PUBLIC_INTERFACE
/**
 * Fetches list of applications (applicant) or application status. Returns array.
 * @param {Object} payload - { token }
 */
export async function getApplicationStatus({ token }) {
  if (!token) throw new Error("Not authenticated");
  const resp = await fetch(`${API_BASE}/epc/application`, {
    headers: {
      ...getAuthHeaders(token)
    }
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    if (resp.status === 401) throw new Error("Please login again");
    throw new Error(error.detail || "Failed to get application status");
  }
  const appList = await resp.json();
  // UI expects singular: pick most recent (if needed adapt for multi-list support)
  if (!Array.isArray(appList) || appList.length === 0) return null;
  const latest = appList.sort((a, b) => (b.created_at?.localeCompare(a.created_at || "") || 0))[0];
  // If application details are needed:
  let detail = latest;
  if (latest && latest.id) {
    const detResp = await fetch(`${API_BASE}/epc/application/${latest.id}`, {
      headers: { ...getAuthHeaders(token) }
    });
    if (detResp.ok) detail = await detResp.json();
  }
  // Map backend status for UI compatibility
  let label = "";
  switch (detail.status) {
    case "submitted":
      label = "Application submitted";
      break;
    case "in_review":
      label = "In police review";
      break;
    case "approved":
      label = "Approved, ready for download";
      break;
    case "rejected":
      label = "Rejected - see notes";
      break;
    default:
      label = detail.status;
  }
  return {
    status: detail.status,
    label,
    certUrl: (detail.status === "approved") ? `${API_BASE}/epc/certificate/${detail.id}/download?token=${token}` : null,
    notes: detail.notes || (detail.status === "rejected" ? "Contact police office." : null),
    id: detail.id
  };
}

// PUBLIC_INTERFACE
/**
 * For admins: fetches all applications.
 * @param {Object} payload - { token }
 */
export async function getApplicationsForAdmin({ token }) {
  if (!token) throw new Error("Not authenticated");
  const resp = await fetch(`${API_BASE}/admin/applications`, {
    headers: { ...getAuthHeaders(token) }
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    if (resp.status === 403) throw new Error("Not authorized (admin access required)");
    throw new Error(error.detail || "Unable to list applications");
  }
  const data = await resp.json();
  // Adapt for UI table: id, applicant, status, date
  return Array.isArray(data)
    ? data.map(a => ({
        id: a.id,
        applicant: a.applicant_name || a.fullname || a.applicant || (a.user_email ?? "-"),
        status: a.status,
        date: (a.created_at || a.date || "").slice(0, 10)
      }))
    : [];
}

// PUBLIC_INTERFACE
/**
 * Process app as admin: approve/reject.
 * @param {Object} payload - { token, appId, approve }
 */
export async function processApplication({ token, appId, approve = false }) {
  if (!token) throw new Error("Not authenticated");
  const resp = await fetch(`${API_BASE}/admin/application/${appId}/decision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token)
    },
    body: JSON.stringify({
      decision: approve ? "approve" : "reject"
    })
  });
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.detail || "Unable to process application");
  }
  return await resp.json();
}

/**
 * Download certificate as blob URL (returns object URL for PDF).
 * Used by applicant. Optionally pass an application ID.
 * @param {Object} payload - { token, appId }
 */
export async function downloadCertificate({ token, appId }) {
  if (!token) throw new Error("Not authenticated");
  if (!appId) throw new Error("Missing application ID");
  const resp = await fetch(`${API_BASE}/epc/certificate/${appId}/download`, {
    headers: { ...getAuthHeaders(token) }
  });
  if (!resp.ok) {
    if (resp.status === 404) throw new Error("Certificate not ready for download yet.");
    const error = await resp.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to download certificate");
  }
  const blob = await resp.blob();
  // Return object URL (callers are responsible for cleanup)
  return window.URL.createObjectURL(blob);
}

/**
 * Admin uploads a certificate PDF for an application.
 * @param {Object} payload - { token, appId, file }
 */
export async function uploadCertificatePDF({ token, appId, file }) {
  if (!token || !appId || !file) throw new Error("Missing parameter");
  const formData = new FormData();
  formData.append("file", file);
  const resp = await fetch(`${API_BASE}/admin/application/${appId}/upload-certificate`, {
    method: "POST",
    headers: { ...getAuthHeaders(token) }, // Accepts multipart
    body: formData
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Upload failed");
  }
  return await resp.json();
}

// PUBLIC_INTERFACE
/**
 * Get user profile details (used for role/context self-check).
 * @param {Object} payload - { token }
 * @returns {Promise<{name, role, is_admin, email}>}
 */
export async function fetchUserProfile({ token }) {
  if (!token) throw new Error("Not authenticated");
  const resp = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeaders(token) }
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch user profile");
  }
  const data = await resp.json();
  return {
    name: data.name || data.fullname || data.email,
    role: data.is_admin ? "admin" : "applicant",
    is_admin: !!data.is_admin,
    email: data.email
  };
}
