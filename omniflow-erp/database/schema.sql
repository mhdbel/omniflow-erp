-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PARTIES (Customers, Patients, Suppliers, Drivers)
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    party_type VARCHAR(50) NOT NULL, -- 'customer', 'supplier', 'patient', 'driver'
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb, -- Flexible PII/Attributes
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. ITEMS (Products, Vehicles, Services)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'pharmacy', 'optician', 'rental'
    base_price NUMERIC(12, 2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'::jsonb, -- Flexible attributes (batch, VIN, lens size)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- GIN index for lightning-fast JSONB queries
CREATE INDEX idx_items_metadata ON items USING GIN (metadata);

-- 3. LEDGER (Event-Sourced Financial & Inventory Movements)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    entry_type VARCHAR(50) NOT NULL, -- 'inventory_in', 'inventory_out', 'revenue'
    party_id UUID REFERENCES parties(id),
    item_id UUID REFERENCES items(id),
    quantity_delta NUMERIC(12, 3) DEFAULT 0,
    value_delta NUMERIC(12, 2) DEFAULT 0.00,
    reference_doc_type VARCHAR(50),
    reference_doc_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_item_time ON ledger_entries (item_id, created_at DESC);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) FOR MULTI-TENANCY
-- ==========================================
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see data belonging to their tenant_id
-- The FastAPI backend will set 'app.current_tenant' on every request
CREATE POLICY tenant_isolation_parties ON parties
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY tenant_isolation_items ON items
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE POLICY tenant_isolation_ledger ON ledger_entries
    USING (tenant_id = current_setting('app.current_tenant')::uuid);