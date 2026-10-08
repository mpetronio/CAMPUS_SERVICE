# Campus Service Request System

React/Vite frontend and Express/MongoDB API for student requests and staff management.

## Local setup

Use Node.js 22.12 or newer and a running MongoDB instance.

1. In `server`, run `npm ci`. Copy `.env.example` to `.env` and configure `MONGODB_URI` and a long random `JWT_SECRET`.
2. In `client`, run `npm ci`. Its default API URL is `http://localhost:5000/api`; copy `.env.example` to `.env` to change it.
3. In `server`, run `npm run dev`; in another terminal, run `npm run dev` from `client`.
4. Open `http://localhost:5173`.

There is no public registration. Existing MongoDB users must have a bcrypt `passwordHash` and a `student` or `staff` role. Add active service categories before creating requests. Never commit real passwords, tokens, or `.env` files.

## Verification

- `client`: `npm run lint` and `npm run build`
- `server`: `npm test` runs integration tests against an isolated temporary MongoDB database; its first run may download a MongoDB test binary. It does not modify your configured database.

Tests cover login, authorization, category search, request creation/validation, ownership, filters, and status transitions.

## Routes and integration

Student routes: `/student/requests`, `/student/requests/new`. Staff routes: `/staff/requests`, `/staff/requests/:id`. Both roles use `/login`.

Ticket branches were developed in chains. Main integrates all completed chains and supplies missing server bootstrapping and shared modules. The API uses standard `{ success, data }` and `{ success, error }` envelopes.
