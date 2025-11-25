# FE (Vite + React)

This directory hosts the professional dashboard, auth flows, and landing page for the agentic resume analysis platform.

## Getting Started

```bash
cd Fe
npm install
cp .env.example .env # create if needed
npm run dev
```

Environment variables:

| Name | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the Node backend (default `http://localhost:3000/api`) |

## Feature Highlights

- Tailwind 4-powered design system with dark, glassmorphic look.
- Authenticated routes (dashboard, profile, editor) guarded via context.
- Dashboard integrates resume parsing, JD inputs, AI insights, history, and live job suggestions.
- Profile and Edit Profile sync with the Node backend for holistic user data.

## Testing & Linting

```bash
npm run lint
```
