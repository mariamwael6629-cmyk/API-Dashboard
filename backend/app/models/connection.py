from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Connection(Base):
    __tablename__ = "connections"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=False)  # openai|stripe|github|slack|discord|google|custom
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    auth_type: Mapped[str] = mapped_column(String(50), nullable=False)  # api_key|oauth|header
    status: Mapped[str] = mapped_column(String(50), default="disconnected", nullable=False)
    credentials: Mapped[dict] = mapped_column(JSON, default=dict)  # masked/encrypted-ish, never returned raw
    rate_limit_used: Mapped[int] = mapped_column(Integer, default=0)
    rate_limit_limit: Mapped[int] = mapped_column(Integer, default=10000)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
