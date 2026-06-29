from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class UnifiedEndpoint(Base):
    __tablename__ = "unified_endpoints"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    source_connections: Mapped[list] = mapped_column(JSON, default=list)  # list[int] connection ids
    transform_config: Mapped[dict] = mapped_column(JSON, default=dict)  # field renaming/merge rules
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
