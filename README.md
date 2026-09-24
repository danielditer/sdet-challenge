# API Bug Report

## Overview

This document summarizes the defects identified during API testing in the **Dev** and **Prod** environments.

---

# Dev Environment

## BUG-DEV-001 — POST /dev/users accepts invalid email and returns 201

**Endpoint:** `POST /dev/users`

**Expected:** HTTP `400 Bad Request` for an invalid email format.

**Actual:** HTTP `201 Created`; the user is created with the invalid email.

**Impact:** Invalid data can be persisted in the system.

---

## BUG-DEV-002 — POST /dev/users returns 500 for duplicated email

**Endpoint:** `POST /dev/users`

**Expected:** HTTP `409 Conflict` when the email already exists.

**Actual:** HTTP `500 Internal Server Error`.

**Impact:** A duplicate-resource condition is incorrectly reported as a server error.

---

## BUG-DEV-003 — DELETE /dev/users returns 204 without authentication

**Endpoint:** `DELETE /dev/users/{email}`

**Expected:** HTTP `401 Unauthorized` when the authentication header is missing.

**Actual:** HTTP `204 No Content`.

**Impact:** A request without authentication is not rejected as expected.

---

## BUG-DEV-004 — DELETE /dev/users returns 404 for invalid authentication

**Endpoint:** `DELETE /dev/users/{email}`

**Expected:** HTTP `401 Unauthorized` when the authentication credentials are invalid.

**Actual:** HTTP `404 Not Found`.

**Impact:** Authentication failures are reported with the wrong status.

---

## BUG-DEV-005 — GET /dev/users by unknown email returns 500

**Endpoint:** `GET /dev/users/{email}`

**Expected:** HTTP `404 Not Found` when the email does not exist.

**Actual:** HTTP `500 Internal Server Error`.

**Impact:** A normal resource-not-found case is incorrectly treated as a server error.

---

## BUG-DEV-006 — POST /dev/users returns inaccurate validation error for invalid field types

**Endpoint:** `POST /dev/users`

**Example payload:**

```json
{
  "name": 123,
  "email": 123,
  "age": "34"
}
```

**Expected:** HTTP `400 Bad Request` with an accurate validation error describing the invalid field types.

**Actual:** HTTP `400 Bad Request`, but the response is:

```json
{
  "error": "Age must be between 1 and 150"
}
```

The request contains invalid types for `name`, `email`, and `age`, so the returned message does not accurately describe the validation failure.

**Impact:** Clients receive misleading validation feedback.

---

# Prod Environment

## BUG-PROD-001 — POST /prod/users accepts invalid email and returns 201

**Endpoint:** `POST /prod/users`

**Expected:** HTTP `400 Bad Request` for an invalid email format.

**Actual:** HTTP `201 Created`; the user is created with the invalid email.

**Impact:** Invalid data can be persisted in the system.

---

## BUG-PROD-002 — POST /prod/users returns 500 for duplicated email

**Endpoint:** `POST /prod/users`

**Expected:** HTTP `409 Conflict` when the email already exists.

**Actual:** HTTP `500 Internal Server Error`.

**Impact:** A duplicate-resource condition is incorrectly reported as a server error.

---

## BUG-PROD-003 — GET /prod/users by unknown email returns 500

**Endpoint:** `GET /prod/users/{email}`

**Expected:** HTTP `404 Not Found` when the email does not exist.

**Actual:** HTTP `500 Internal Server Error`.

**Impact:** A normal resource-not-found case is incorrectly treated as a server error.

---

## BUG-PROD-004 — POST /prod/users returns inaccurate validation error for invalid field types

**Endpoint:** `POST /prod/users`

**Example payload:**

```json
{
  "name": 123,
  "email": 123,
  "age": "34"
}
```

**Expected:** HTTP `400 Bad Request` with an accurate validation error describing the invalid field types.

**Actual:** HTTP `400 Bad Request`, but the response is:

```json
{
  "error": "Age must be between 1 and 150"
}
```

The response does not accurately identify the invalid field types.

**Impact:** Clients receive misleading validation feedback.

---

# Summary

| ID | Environment | Endpoint | Issue | Expected | Actual |
|---|---|---|---|---:|---:|
| BUG-DEV-001 | Dev | POST /dev/users | Invalid email accepted | 400 | 201 |
| BUG-DEV-002 | Dev | POST /dev/users | Duplicate email | 409 | 500 |
| BUG-DEV-003 | Dev | DELETE /dev/users/{email} | Missing authentication | 401 | 204 |
| BUG-DEV-004 | Dev | DELETE /dev/users/{email} | Invalid authentication | 401 | 404 |
| BUG-DEV-005 | Dev | GET /dev/users/{email} | Unknown email | 404 | 500 |
| BUG-DEV-006 | Dev | POST /dev/users | Inaccurate type validation error | 400 + accurate error | 400 + inaccurate error |
| BUG-PROD-001 | Prod | POST /prod/users | Invalid email accepted | 400 | 201 |
| BUG-PROD-002 | Prod | POST /prod/users | Duplicate email | 409 | 500 |
| BUG-PROD-003 | Prod | GET /prod/users/{email} | Unknown email | 404 | 500 |
| BUG-PROD-004 | Prod | POST /prod/users | Inaccurate type validation error | 400 + accurate error | 400 + inaccurate error |

## Testing Note

These defects were identified through automated API testing. The corresponding tests document the expected API contract and can be referenced alongside this report.

Known-defect tests should remain traceable to these bug IDs rather than changing their expected results to match the current incorrect API behavior.
