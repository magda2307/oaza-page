from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    r2_account_id: str = ""
    r2_access_key: str = ""
    r2_secret_key: str = ""
    r2_bucket: str = ""
    r2_public_url: str = ""

    cors_allowed_origins: list[str] = ["http://localhost:3000"]

    podatek_redirect_url: str = "https://podatki.gov.pl"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "noreply@kocia-oaza.pl"
    smtp_tls: bool = True

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
