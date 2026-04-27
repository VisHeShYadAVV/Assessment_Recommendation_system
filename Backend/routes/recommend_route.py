from fastapi import APIRouter, Request, Query
from typing import Optional
from pydantic import BaseModel
from models.assessment_model import SHLModel

router = APIRouter()

model = SHLModel("data/shl_real_assessments.csv")

class RecommendRequest(BaseModel):
    query: str
    top_n: int = 5

@router.api_route("/recommend", methods=["GET", "POST"])
async def recommend_unified(
    request: Request,
    query: Optional[str] = Query(None),
    k: Optional[int] = Query(5)
):
    if request.method == "POST":
        body = await request.json()
        search_query = body.get("query", "")
        top_n = body.get("top_n", 5)
        return model.recommend(search_query, top_n)
    else:
        # GET request
        return model.recommend(query, k)
