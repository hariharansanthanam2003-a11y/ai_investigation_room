# AI Mystery Room

An interactive, fictional detective game built with React, Express, MongoDB, and Gemini. See [spec.md](./spec.md) for the complete product and security requirements.

## Requirements

- Node.js 20 or newer and npm
- MongoDB locally or a MongoDB Atlas connection string
- A Google Gemini API key to generate new AI cases (the sample case works without Gemini)

## Setup

1. Run `npm install` at the repository root, then `npm install --prefix client` and `npm install --prefix server`.
2. Copy `server/.env.example` to `server/.env` and configure `MONGODB_URI`, `GEMINI_API_KEY`, and optionally `GEMINI_MODEL`.
3. Copy `client/.env.example` to `client/.env` if the API is not at its default URL.
4. Run `npm run dev`. Vite runs on port 5173 and the API on port 5000.

The landing page and sample mystery work without MongoDB or Gemini. Persisted AI cases require MongoDB and Gemini. MongoDB is never installed or started by this app. Set `MONGODB_URI` to your Atlas URI to use Atlas instead of a local instance.

## Commands

- `npm run dev` — start frontend and backend together
- `npm run build` — build the frontend
- `npm test` — run backend and frontend tests

## Troubleshooting

- **Database unavailable:** Start your MongoDB service or verify the Atlas URI and network access. Database-dependent API requests return a service error when disconnected.
- **Gemini generation unavailable:** Check `GEMINI_API_KEY`, model access, and provider quotas. The sample case remains available.
- **Frontend cannot reach API:** Confirm the server is on port 5000 and check `VITE_API_BASE_URL` in `client/.env`.
