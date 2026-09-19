from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import router
from app.core.config import settings

STATIC_DIR = Path(__file__).resolve().parent / "static"


def create_app() -> FastAPI:
    app = FastAPI(
        title=f"{settings.PROJECT_NAME} - Admin & Data Ingestion Platform",
        version=settings.VERSION,
        description="Production Data Ingestion Pipeline (ETL & Knowledge Graph Construction) for IP-SAKTI Sahayak",
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes under /api and /api/v1
    app.include_router(router, prefix="/api")
    app.include_router(router, prefix="/api/v1")

    @app.get("/health")
    def health_check():
        return {
            "status": "ok",
            "service": "IP-SAKTI Ingestion Engine",
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION,
        }

    # Mount static files for the Admin Light Theme Frontend at /
    if STATIC_DIR.exists():
        app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

    return app


app = create_app()
