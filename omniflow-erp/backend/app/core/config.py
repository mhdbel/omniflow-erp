from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database URL (Update with your actual credentials)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/erp_db"
    ALGORITHM: str = "HS256"
    MOCK_AUTH_ENABLED: bool = True # Toggle for Sprint 1

    class Config:
        env_file = ".env"

settings = Settings()