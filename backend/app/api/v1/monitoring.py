from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.monitoring import Heatmap, MonitoringOverview, TrafficSeries
from app.services import monitoring_service

router = APIRouter(prefix="/monitoring", tags=["monitoring"])


@router.get("/overview", response_model=MonitoringOverview)
async def overview(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    data = await monitoring_service.get_overview(db)
    return MonitoringOverview(**data)


@router.get("/traffic", response_model=TrafficSeries)
async def traffic(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    points = await monitoring_service.get_traffic_series(db)
    return TrafficSeries(points=points)


@router.get("/heatmap", response_model=Heatmap)
async def heatmap(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = await monitoring_service.get_heatmap(db)
    return Heatmap(rows=rows)
