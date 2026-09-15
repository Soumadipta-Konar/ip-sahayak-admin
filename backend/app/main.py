from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Multi-Agent LangGraph API for Ayurveda IPR"
    )

    # Set up CORS for the Next.js frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, restrict to frontend domain
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router, prefix="/api/v1")

    @app.get("/health")
    def health_check():
        return {"status": "ok", "environment": settings.ENVIRONMENT}

    return app


app = create_app()
