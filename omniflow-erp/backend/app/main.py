from fastapi import FastAPI
from app.api.v1 import items

app = FastAPI(title="OmniFlow ERP API", version="1.0.0")

# Include routers
app.include_router(items.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "OmniFlow ERP is running"}