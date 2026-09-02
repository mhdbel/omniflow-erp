from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from casbin import AsyncEnforcer
import uuid

security = HTTPBearer()

# --- MOCK AUTH (Replace with Clerk/Auth0 JWT validation in Prod) ---
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    
    # Mocking different roles for testing
    if token == "admin_token":
        # In prod, extract tenant_id from the JWT claims
        return {"user_id": "u1", "role": "tenant_admin", "tenant_id": "11111111-1111-1111-1111-111111111111"}
    elif token == "staff_token":
        return {"user_id": "u2", "role": "staff", "tenant_id": "11111111-1111-1111-1111-111111111111"}
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- CASBIN AUTHORIZATION ---
enforcer = None

async def get_enforcer():
    global enforcer
    if enforcer is None:
        # Load the model and policy files
        enforcer = await AsyncEnforcer.new_enforcer('casbin_model.conf', 'casbin_policy.csv')
    return enforcer