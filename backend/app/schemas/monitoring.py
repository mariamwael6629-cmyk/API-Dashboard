from pydantic import BaseModel


class MonitoringOverview(BaseModel):
    uptime_pct: float
    total_requests: int
    error_rate_pct: float
    avg_latency_ms: float


class TrafficPoint(BaseModel):
    time: str
    requests: int
    errors: int
    latency: int


class TrafficSeries(BaseModel):
    points: list[TrafficPoint]


class HeatmapCell(BaseModel):
    hour: str
    value: int


class HeatmapRow(BaseModel):
    day: str
    cells: list[HeatmapCell]


class Heatmap(BaseModel):
    rows: list[HeatmapRow]
