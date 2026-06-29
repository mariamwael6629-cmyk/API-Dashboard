from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EnvVariableCreate(BaseModel):
    key: str = Field(min_length=1, max_length=255)
    value: str = Field(default="", max_length=2000)


class EnvVariableUpdate(BaseModel):
    value: str = Field(max_length=2000)


class EnvVariableOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    key: str
    value: str
    created_at: datetime
