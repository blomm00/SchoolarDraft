# TASK 2: Backend Development & Database

## Segment Overview
Set up the Node.js server to handle asynchronous operations, secure API requests, and integrate with Firebase Firestore for user authentication and document persistence.

## Sub-Tasks

### 1. Server Setup & Architecture
- [ ] Initialize a Node.js project with Express.js.
- [ ] Configure environment variables securely (`.env`) for Firebase credentials and Gemini API keys.
- [ ] Set up CORS and basic security middleware (Helmet, rate limiting) to protect the API endpoints.

### 2. Firebase Integration (Authentication & Database)
- [ ] Integrate Firebase Admin SDK in the Node.js backend.
- [ ] Set up Firebase Authentication (Email/Password and Google OAuth).
- [ ] Design Firestore database schema:
  - `users` collection (profiles, roles)
  - `documents` collection (drafts, metadata, timestamps)
- [ ] Create REST API endpoints for the frontend to perform CRUD operations on user documents (`GET /api/docs`, `POST /api/docs`, `PUT /api/docs/:id`).

### 3. API Gateway for AI Services
- [ ] Create secure wrapper endpoints in Express to communicate with the Gemini API (to prevent exposing the Gemini API key on the React frontend).
- [ ] Example endpoints to create:
  - `POST /api/ai/citation`
  - `POST /api/ai/enhance`
  - `POST /api/ai/ethics-scan`
- [ ] Implement error handling and timeout configurations for long-running AI requests.
