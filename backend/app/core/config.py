from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()