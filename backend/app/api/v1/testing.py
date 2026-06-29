from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.testing import TestRunRequest, TestRunResponse
from app.services import testing_service

router = APIRouter(prefix="/testing", tags=["testing"])


@router.post("/run", response_model=TestRunResponse)
async def run_test(
    payload: TestRunRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await testing_service.run_test(db, payload)
    return TestRunResponse(**result)
