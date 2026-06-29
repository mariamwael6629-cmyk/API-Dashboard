from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_router, ws
from app.core.config import settings
from app.db.session import Base, engine

# Import models so they register on Base.metadata before create_all runs.
from app import models  # noqa: F401

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Aggregates OpenAI, Stripe, GitHub, Slack, Discord, Google and "
    "custom APIs behind unified, monitored endpoints.",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )


@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "service": settings.PROJECT_NAME}


app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(ws.router)
