# Nexora — API Aggregation Dashboard

Nexora is an AI-native API aggregation platform featuring a futuristic dashboard designed to connect third-party APIs (OpenAI, Stripe, GitHub, Slack, Discord, Google, and custom integrations). It aggregates them behind unified endpoints, monitors traffic in real time, and manages everything through a modern glassmorphism, dark-neon user interface.

The project is split into two primary architectures:

* **`frontend/`**: A React 19 + Vite + Tailwind CSS v4 Single Page Application (SPA).
* **`backend/`**: A FastAPI + PostgreSQL asynchronous API.

---

## 🚀 Quick Start

### 1. Backend Setup (Choose One)

**Option A: Using Docker (Recommended for PostgreSQL)**

```bash
cd backend
cp .env.example .env 
docker-compose up --build

```

**Option B: Local Setup (Using SQLite)**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
DATABASE_URL="sqlite+aiosqlite:///./dev.db" uvicorn app.main:app --reload --port 8000

```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173

```

> **Note:** The frontend development server automatically proxies `/api` and `/ws` requests to `http://localhost:8000`. Ensure the backend service is running first. Detailed API documentation is accessible at `http://localhost:8000/docs`.

---

## 💻 Frontend Architecture (`frontend/`)

Built using **React 19**, **React Router 7** (with lazy-loaded routes), **Tailwind CSS v4** (utilizing CSS-first `@theme` tokens via `@tailwindcss/vite` configuration in `src/index.css`), **Framer Motion**, **Recharts**, **Zustand**, **Axios** (configured with a JWT-bearer client), **cmdk** (⌘K command palette), and **sonner** for elegant toast notifications.

### Available Scripts

```bash
npm run dev       # Starts local development server on http://localhost:5173
npm run build     # Compiles production-ready build to dist/
npm run preview   # Previews the compiled production build
npm run lint      # Runs code linting checks via oxlint

```

### Application Routes

* **Public:** `/` (Landing Page), `/login` (Authentication)
* **Protected App Workspace** (Authenticated via `AppLayout`):
* Dashboard, Marketplace, Analytics, Workflow Builder, Testing Lab, Team, Billing, AI Assistant, and Settings.



### Directory Structure

```text
frontend/src/
  ├── components/
  │    ├── ui/         # Shared primitive layout tokens (GlassCard, Button, Badge, Skeleton, EmptyState)
  │    └── layout/     # Core application chrome (Sidebar, Topbar, CommandPalette, BackgroundFX, AppLayout)
  │    └── widgets/    # Specialized per-page feature modules and interactive components
  ├── hooks/           # Custom React hooks (e.g., useLiveFeed supporting WebSocket with simulation fallback)
  ├── lib/             # API client instances (api.js) and local mock demonstration data (mockData.js)
  ├── pages/           # Individual route view controllers
  └── store/           # Zustand global state managers (uiStore, authStore)

```

> **Resilience System:** If the backend WebSocket connection drops, `useLiveFeed` switches dynamically to simulation mode to prevent UI breakages. Third-party views dynamically render data provided by the active backend layer.

---

## ⚙️ Backend Architecture (`backend/`)

Powered by asynchronous **FastAPI**, **Uvicorn**, **SQLAlchemy 2.0** (Async execution) paired with **asyncpg** for PostgreSQL (supports **aiosqlite** for quick lightweight local debugging), **Pydantic v2** data validation models, **python-jose** (JWT signing) + **passlib/bcrypt**, and **httpx** for non-blocking outbound requests to provider APIs.

### Configuration & Environment Variables (`backend/.env`)

Ensure you configure your local environment settings using the provided `.env.example` file:

* `DATABASE_URL`: Target database system path (Defaulted to match `docker-compose.yml`).
* `SECRET_KEY`: Cryptographic signing key for authorization security tokens. Generate using: `openssl rand -hex 32`.
* `CORS_ORIGINS`: JSON array format setting containing permitted web app network locations.
* `Provider Credentials`: Fill out live API keys (`OPENAI_API_KEY`, `STRIPE_API_KEY`, etc.) to automatically toggle adapters from simulation behavior to live server integrations.

### System Directory Layout

```text
backend/app/
  ├── api/v1/         # Domain-driven route controllers (auth, workflows, aggregation, monitoring, etc.)
  ├── core/           # System configuration management (config.py) and authentication security protocols
  ├── db/             # Asynchronous database engines, session creators, and declarative Base templates
  ├── models/         # Heavyweight database layer schemas managed via SQLAlchemy
  ├── schemas/        # Structured request-response payload validators powered by Pydantic
  ├── services/       # Core enterprise business logic processing engines
  ├── integrations/   # Vendor API translation layers (Switches from mock to live data securely)
  ├── websockets/     # High-throughput client subscription management for streaming monitoring tickers
  └── main.py         # Application factory setup, CORS middlewares, and route declarations

```

### API References & Core Routes

* **Swagger UI:** `http://localhost:8000/docs`
* **ReDoc:** `http://localhost:8000/redoc`
* **Health Check System:** `GET /health`

| Functional Area | Endpoint Signature Examples |
| --- | --- |
| **Authentication** | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| **Connections** | `GET /api/v1/connections`, `POST /api/v1/connections/{id}/test` |
| **Aggregation** | `GET /api/v1/aggregation`, `POST /api/v1/aggregation/{id}/execute` |
| **Live Monitoring** | `GET /api/v1/monitoring/overview`, `WS /ws/monitoring` (Dispatches ticks every 2s) |
| **Workflows** | `GET /api/v1/workflows`, `POST /api/v1/workflows` |
| **Testing Lab** | `POST /api/v1/testing/run` |
| **AI Assistant** | `POST /api/v1/assistant/chat` |
| **System Webhooks** | `/api/v1/webhooks`, `/api/v1/env-vars` |

---