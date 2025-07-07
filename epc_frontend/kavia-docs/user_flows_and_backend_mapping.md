# EPC Frontend: Implemented User Flows and Mapping to Backend Endpoints

This document audits all currently implemented user features, screens, and flows in the React frontend for the Electronic Police Certificate system, and maps them to the backend API endpoints they are (or should be) integrated with. This audit enables clear identification of integration points and potential feature gaps.

---

## Table of Contents

- [Applicant User Flows](#applicant-user-flows)
  - [Registration](#registration)
  - [Login](#login)
  - [Dashboard View](#dashboard-view)
  - [Certificate Application Form](#certificate-application-form)
  - [Track Application Status](#track-application-status)
  - [Download Certificate](#download-certificate)
- [Administrator User Flows](#administrator-user-flows)
  - [Admin Dashboard View](#admin-dashboard-view)
  - [Approve/Reject Applications](#approvereject-applications)
- [Feature Mapping Table](#feature-mapping-table)
- [Summary of Integration Gaps & Notes](#summary-of-integration-gaps--notes)
- [Comparison Against Backend API Documentation](#comparison-against-backend-api-documentation)
- [Concrete Recommendations](#concrete-recommendations)

---

## Applicant User Flows

### Registration

- **Screen:** `RegisterPage.js`
- **Frontend Behavior:** Collects name, email, password, submit/confirm password fields. Handles form validation and submission.
- **Backend Endpoint:** `POST /auth/register`
- **Integration:** Currently calls `registerUser` from `api.js` (mock). Needs to POST to real backend and handle API response and errors.

### Login

- **Screen:** `LoginPage.js`
- **Frontend Behavior:** Collects email and password, handles login via form.
- **Backend Endpoint:** `POST /auth/login`
- **Integration:** Calls `loginUser` from `api.js` (mock). Should make real call to `/auth/login` and store token, then set user role/context from backend response.

### Dashboard View

- **Screen:** `ApplicantDashboard.js`
- **Frontend Behavior:** Shows quick actions: Apply for Certificate, Track Application Status.
- **Integration:** No backend call in this component directly; navigation to main flows.

### Certificate Application Form

- **Screen:** `CertificateForm.js`
- **Frontend Behavior:** Collects full name, DOB, address, passport, nationality, handles submission and notification on success/failure.
- **Backend Endpoint:** `POST /epc/application`
- **Integration:** Calls `submitCertificateApplication` from `api.js` (mock). Needs to submit real application data with token in header.

### Track Application Status

- **Screen:** `StatusTracker.js`
- **Frontend Behavior:** Shows current status and notes of last application, updates UI according to application result, and provides certificate download if available.
- **Backend Endpoints:** 
  - List/app details: `GET /epc/application` and/or `GET /epc/application/{app_id}`
- **Integration:** Calls `getApplicationStatus` from `api.js` (mock, returns random status). Should fetch application list/details from backend and map application statuses accordingly.

### Download Certificate

- **Screen:** Linked in `StatusTracker.js` UI when application status is "approved".
- **Backend Endpoint:** `GET /epc/certificate/{app_id}/download`
- **Integration:** Currently downloads a static file or no op; needs to trigger real download from backend when URL and status allow.

---

## Administrator User Flows

### Admin Dashboard View

- **Screen:** `AdminDashboard.js`
- **Frontend Behavior:** Upon login as admin, displays all pending applications in a table: ID, applicant, date, status, actions.
- **Backend Endpoint:** `GET /admin/applications`
- **Integration:** Calls `getApplicationsForAdmin` from `api.js` (mock). Should fetch all applications from backend as admin.

### Approve/Reject Applications

- **Screen:** `AdminDashboard.js` (Buttons "Approve" / "Reject")
- **Backend Endpoint:** `POST /admin/application/{app_id}/decision`
- **Integration:** Calls `processApplication` from `api.js` (mock). Should send actual decision and admin notes to backend with authentication.

---

## Feature Mapping Table

| UI Component           | Purpose/Action              | Backend Endpoint                                  | Auth Required? | Current State      |
|------------------------|----------------------------|---------------------------------------------------|:--------------:|:------------------:|
| RegisterPage           | User registration          | POST /auth/register                               | No             | Mocked            |
| LoginPage              | User login/token           | POST /auth/login                                  | No             | Mocked            |
| CertificateForm        | Submit certificate app     | POST /epc/application                             | Yes (user)     | Mocked            |
| StatusTracker          | Check application status   | GET /epc/application, GET /epc/application/{id}   | Yes (user)     | Mocked, random    |
| StatusTracker          | Download certificate file  | GET /epc/certificate/{app_id}/download            | Yes (user)     | Static/mock only  |
| AdminDashboard         | List all applications      | GET /admin/applications                           | Yes (admin)    | Mocked            |
| AdminDashboard         | Approve/reject app         | POST /admin/application/{app_id}/decision         | Yes (admin)    | Mocked            |
| -                      | Upload certificate PDF     | POST /admin/application/{app_id}/upload-certificate| Yes (admin)   | Not implemented   |

---

## Summary of Integration Gaps & Notes

- All frontend API calls in `src/api.js` are **mocked** and do not make real HTTP requests to the backend. Replace with fetch/XHR to real endpoints using correct URLs and request/response formats.
- **Token management**: Currently stores token in `user` object in localStorage; must attach this as `Authorization` header for all authenticated calls.
- **User roles**: Role assigned/guessed from frontend logic. Should be determined from backend response (e.g. is_admin, etc).
- **Application status**: UI expects random states; must be wired to real application list/status as provided by backend for accurate display and download linking.
- **Certificate download/upload**: Only "download" button provided for applicant; admin upload NOT yet implemented in UI.
- **Admin functionality**: Approve/reject flows are present for admin, but upload certificate feature is missing in AdminDashboard.
- **User profile info**: No dedicated profile/view info, nor proper use of `/auth/me` to get user context.
- **No multi-applicant support**: UI does not support displaying a list of applications per user; only interacts as if one application exists.

---

## Comparison Against Backend API Documentation

The following section highlights all major mappings and gaps as determined by cross-referencing the audited React frontend codebase with the backend endpoint documentation (`api_endpoints.md`):

### What is fully mapped/implemented:
- All *core user flows* (registration, login, application form, applicant/admin dashboard, status tracking, admin approve/reject) exist in some form in the UI, corresponding to real backend API endpoints.
- Screens use modular React functional components with clear separation per flow.

### Missing or Mock-Only Integration

| Feature                                      | Frontend UI Status            | Backend API Status                                   | Gaps / Needs Integration                   |
|-----------------------------------------------|-------------------------------|-----------------------------------------------------|---------------------------------------------|
| User registration/login                      | UI present (mocked only)      | Fully implemented (`/auth/register`, `/auth/login`)  | Switch all calls to use real REST backend with error handling. Use backend token/roles. |
| Certificate application                      | Form UI present (mocked only) | Implemented (`POST /epc/application`)                | Send real data to backend. Attach bearer token. |
| Application status display                   | Mocked/random logic only      | Implemented (`GET /epc/application`, `/epc/application/{app_id}`) | Must fetch real user list + app details and present actual status. |
| Certificate download (PDF)                   | UI link exists; not functional| Implemented (`GET /epc/certificate/{app_id}/download`)| Download actual file from backend based on app_id and status. |
| Admin: list all applications                 | Table UI (mock only)          | Implemented (`GET /admin/applications`)              | Populate with real backend data.            |
| Admin: approve/reject application            | Buttons/handler, mock only    | Implemented (`POST /admin/application/{app_id}/decision`) | Implement real PATCH/POST to backend with payload and token. |
| Admin: upload certificate (PDF)              | Not currently in UI           | Implemented (`POST /admin/application/{app_id}/upload-certificate`) | Add admin UI for PDF upload.                |
| User/applicant can have multiple applications| Not supported in UI           | Implemented in backend with listing endpoint         | Extend UI to display/apply for multiple applications. |
| User info/profile fetch                      | Not present in UI             | `/auth/me` implemented                               | Call for context and correct roles, show user details where relevant. |
| User role logic                              | Guessed by UI                 | Proper flag via backend (`is_admin`)                 | Trust backend; update local logic so role is based on backend. |
| Application list (per applicant, per admin)  | Single-app logic only         | Multi-application support in backend                 | Add lists where user may have >1 application. |

### General Gaps

- **All API functions in `api.js` are using development-only logic and not calling the backend at all.**
- **No networking (fetch/axios) to backend on any user or admin flow.**
- **Token is not actually sent in Authorization header for authenticated routes.**
- **Admin cannot upload certificates in UI.**
- **No UI for `/auth/me` or "user profile," including role trust from backend.**
- **No user-facing error handling for permission/403/401 from backend (all handled as mock errors).**

---

## Concrete Recommendations

- Refactor all API utility functions in `api.js` to use `fetch` or similar to make real requests to the backend URLs, matching request/response formats, passing bearer token in headers.
- Make UI state and role trust the backend's user model (`/auth/me`) not guesses from email.
- Implement multi-application support and lists for both applicants and admins.
- Ensure certificate download and upload work via backend using blob/file APIs.
- Integrate all error handling based on actual backend HTTP responses.
- Add an admin interface for certificate PDF upload.
- Provide user details/profile fetched via backend.

---

**This mapping is current as of review of the following UI files:**
- `/src/pages/RegisterPage.js`
- `/src/pages/LoginPage.js`
- `/src/pages/CertificateForm.js`
- `/src/pages/StatusTracker.js`
- `/src/pages/AdminDashboard.js`
- `/src/api.js`

**This mapping is based on backend (`api_endpoints.md`) as of the same date.**

_This document was auto-generated for audit and integration planning._
