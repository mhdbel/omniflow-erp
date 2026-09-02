from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.deps import set_tenant_and_check_perm
from app.models.models import Item
from app.schemas.items import ItemCreate, ItemResponse

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    item_in: ItemCreate,
    context: tuple = Depends(lambda: set_tenant_and_check_perm("item", "write"))
):
    user, db = context
    
    # Check if SKU already exists (RLS ensures we only check within this tenant)
    result = await db.execute(select(Item).where(Item.sku == item_in.sku))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="SKU already exists in this tenant")

    # Create ORM instance
    db_item = Item(
        tenant_id=user["tenant_id"],
        **item_in.model_dump()
    )
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    
    # TODO: Emit Webhook to Activepieces here!
    
    return db_item

@router.get("/", response_model=list[ItemResponse])
async def list_items(
    skip: int = 0,
    limit: int = 100,
    context: tuple = Depends(lambda: set_tenant_and_check_perm("item", "read"))
):
    user, db = context
    result = await db.execute(select(Item).offset(skip).limit(limit))
    return result.scalars().all()