# EPC Frontend: Missing Backend Integration Report

This report identifies all features and user flows in the EPC React frontend that currently lack integration with the real backend endpoints (as of current audit), remain dependent on mock data, or are otherwise unfinished in terms of connection to backend APIs.

## Summary

Based on a comparison of the documented backend endpoints (see `api_endpoints.md`) and the actual frontend user flow mapping (see `user_flows_and_backend_mapping.md`), **all API functions in `src/api.js` are currently mocked** and real backend networking is not implemented for any flow.

---

## Detailed List of UI Flows Missing Real Backend Integration

### 1. User Registration

- **UI**: `RegisterPage.js` (uses `registerUser` in `api.js`)
- **Current State**: Submits to mock handler. No request to `/auth/register`.
- **Backend Integration Needed**:
  - Send POST request to `/auth/register` with real user data.
  - Handle real backend errors and display to user.

---

### 2. User Login

- **UI**: `LoginPage.js` (`loginUser` in `api.js`)
- **Current State**: Submits to mock handler. No request to `/auth/login`.
- **Backend Integration Needed**:
  - POST to `/auth/login` (form-encoded), parse token/type from backend.
  - Establish real session using backend token; store tokens/roles from backend response.

---

### 3. Application Submission

- **UI**: `CertificateForm.js` (`submitCertificateApplication` in `api.js`)
- **Current State**: Submits to mock handler; does not send request to backend.
- **Backend Integration Needed**:
  - POST to `/epc/application` with form payload and Authorization bearer token.
  - Capture errors and display backend validation failures.

---

### 4. Application Status Tracking

- **UI**: `StatusTracker.js` (`getApplicationStatus` in `api.js`)
- **Current State**: Only returns random mock statuses; no API request.
- **Backend Integration Needed**:
  - Fetch list of user's applications using `GET /epc/application`.
  - Optionally details with `GET /epc/application/{app_id}`.
  - Use actual application status from backend to control UI.

---

### 5. Certificate Download

- **UI**: `StatusTracker.js` (certificate download link shown if "approved")
- **Current State**: Static link or inoperative; does not hit production backend.
- **Backend Integration Needed**:
  - When available, trigger real file download via `GET /epc/certificate/{app_id}/download` (send auth header).
  - Handle error when not yet issued.

---

### 6. Applicant Multi-Application Support

- **UI**: Only a single-application flow handled per applicant.
- **Backend Capability**: User can have multiple applications in backend.
- **Backend Integration Needed**:
  - Fetch and display user's full application list.
  - Let user select/track/download certificates for any application.

---

### 7. Admin - View All Applications

- **UI**: `AdminDashboard.js` (calls `getApplicationsForAdmin` in `api.js`)
- **Current State**: Loads mock table; does not call real backend.
- **Backend Integration Needed**:
  - `GET /admin/applications` (auth as admin).
  - Populate UI from backend response.

---

### 8. Admin - Approve/Reject Application

- **UI**: Action handlers in `AdminDashboard.js` (`processApplication` in `api.js`)
- **Current State**: Just mocks; does not post to backend.
- **Backend Integration Needed**:
  - Send real POST to `/admin/application/{app_id}/decision` with payload.
  - Use bearer token in Authorization header.
  - Display success or error according to response.

---

### 9. Admin - Upload Certificate PDF

- **UI**: **No UI implemented yet**
- **Backend Endpoint Exists**: `POST /admin/application/{app_id}/upload-certificate`
- **Integration Needed**:
  - Add admin form/component for uploading a certificate PDF.
  - Support multipart upload and link to backend endpoint.
  - Handle success/error display.

---

### 10. User Profile/Role Context

- **UI**: None (role guessed locally in UI)
- **Backend Endpoint Exists**: `/auth/me`
- **Backend Integration Needed**:
  - On login, fetch `/auth/me` using stored token to confirm profile, role, status.
  - Use `is_admin` from backend, not email guessing, to determine permissions and available UI actions.

---

### 11. General Issues Needed Across All Flows

- All requests requiring authentication must pass correct `Authorization: Bearer <token>` headers.
- API error codes (401, 403, 400) need to be handled and displayed in UI.
- All current state management assumes single application/user, must support more.
- Frontend does not yet display backend error validation messages to user.

---

## Conclusion

**Immediate next steps for frontend integration:**
- Replace all mock APIs in `src/api.js` with proper fetch/XHR to real backend endpoints.
- Implement missing flows (admin upload certificate, user profile load, multi-application UI).
- Trust backend for role and authentication/authorization — never guess in UI.
- Ensure errors and file downloads are handled cleanly in applicant and admin flows.

**For full table of supported endpoints, see [`api_endpoints.md`](../../vanuatu-e-police-cert-app-117850-755b6c8c/epc_backend/kavia-docs/api_endpoints.md).**

Last updated after full audit of source and mapping documentation.

