## Node Backend

Express + MongoDB service that handles authentication, profile management, resume analysis orchestration, and job suggestions.

### Setup

```bash
cd Backend
npm install
cp env.example .env # create based on values below
npm run dev
```

Environment variables required:

| Name | Description |
| --- | --- |
| `PORT` | Server port (default `3000`) |
| `FRONTEND_URL` | Comma separated allowed origins |
| `MONGODB_URL` | Mongo connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `AI_BACKEND_URL` | FastAPI service URL (default `http://localhost:8000`) |

### API Surface

- `POST /api/auth/signup` – create account (returns token & user)
- `POST /api/auth/login` – authenticate (returns token & user)
- `GET /api/users/me` – fetch profile (auth)
- `PUT /api/users/me` – update profile (auth)
- `POST /api/analysis` – upload resume + JD, calls AI backend and stores history (auth, multipart)
- `GET /api/analysis/history` – recent analyses for the signed-in user

### Scripts

- `npm run dev` – nodemon with live reload
- `npm start` – production run

