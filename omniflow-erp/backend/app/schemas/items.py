from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
from decimal import Decimal
import uuid
from datetime import datetime

class ItemBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=255)
    category: str
    base_price: Decimal = Field(..., ge=0)
    metadata: Optional[Dict[str, Any]] = {}

    # Enforce vertical-specific metadata rules at the API level
    @field_validator('metadata')
    def validate_metadata(cls, v, info):
        category = info.data.get('category')
        if category == 'pharmacy' and ('batch' not in v or 'expiry' not in v):
            raise ValueError('Pharmacy items require batch and expiry in metadata')
        if category == 'rental' and 'vin' not in v:
            raise ValueError('Rental vehicles require a VIN in metadata')
        return v

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: uuid.UUID
    tenant_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True