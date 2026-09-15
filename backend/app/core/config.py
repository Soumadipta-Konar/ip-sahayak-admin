from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "IP-SAKTI Sahayak"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Secret Keys (Loaded from environment, DO NOT hardcode)
    OPENAI_API_KEY: str = ""
    BHASHINI_API_KEY: str = ""
    
    # Database URLs
    QDRANT_URL: str = "http://localhost:6333"
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASS: str = "ipsakti_secret_password"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
