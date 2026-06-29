from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PlanFeature(BaseModel):
    id: str
    name: str
    price: int
    tagline: str
    highlight: bool = False
    features: list[str]


class PlansResponse(BaseModel):
    plans: list[PlanFeature]


class SubscriptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    plan: str
    status: str
    current_period_end: datetime
    created_at: datetime


class CheckoutRequest(BaseModel):
    plan: str = Field(pattern="^(starter|pro|scale)$")


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
    mock: bool


class UsageResponse(BaseModel):
    plan: str
    requests_used: int
    requests_limit: int
    connections_used: int
    connections_limit: int
    period_end: datetime
