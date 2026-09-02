from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db
from app.core.security import get_current_user, get_enforcer

# This single dependency handles AuthZ, RLS context, and DB injection
async def set_tenant_and_check_perm(
    resource: str,
    action: str,
    db: AsyncSession = Depends(get_db),
    user = Depends(get_current_user),
    enforcer = Depends(get_enforcer)
):
    # 1. Check Casbin RBAC/ABAC Policies
    is_allowed = await enforcer.enforce(user["role"], resource, action)
    if not is_allowed:
        raise HTTPException(status_code=403, detail=f"Role '{user['role']}' cannot '{action}' on '{resource}'")

    # 2. Set PostgreSQL RLS Context for this specific transaction
    # This guarantees the DB only returns/modifies data for this user's tenant
    tenant_id = user["tenant_id"]
    await db.execute(text(f"SET LOCAL app.current_tenant = '{tenant_id}'"))
    
    # Return both user context and db session to the route
    return user, db