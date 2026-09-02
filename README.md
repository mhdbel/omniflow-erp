omniflow-erp/
├── database/
│   └── schema.sql
├── backend/
│   ├── requirements.txt
│   ├── casbin_model.conf
│   ├── casbin_policy.csv
│   └── app/
│       ├── main.py
│       ├── core/
│       │   ├── config.py
│       │   ├── database.py
│       │   └── security.py
│       ├── models/
│       │   └── models.py
│       ├── schemas/
│       │   └── items.py
│       └── api/
│           ├── deps.py
│           └── v1/
│               └── items.py
└── frontend/
    ├── next.config.js
    ├── public/
    │   └── manifest.json
    ├── lib/
    │   └── offline-db.ts
    ├── hooks/
    │   └── useCart.ts
    └── components/
        ├── items/
        │   └── ItemForm.tsx
        └── sales/
            └── POS.tsx
