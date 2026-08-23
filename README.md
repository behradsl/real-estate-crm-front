# Real Estate CRM Frontend

Next.js + Tailwind + shadcn/ui client for the NestJS real-estate CRM API.

## Setup

```bash
pnpm install
cp .env.local.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your backend (default `http://localhost:9100`).

## Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth

Uses cookie sessions (`credentials: "include"`).

- Platform ADMIN: leave organization slug empty
- Org users: provide organization slug + email/password

## App areas

- Dashboard
- Properties (with facilities + deedInfo JSON)
- Parties
- Contracts (terms templates per contract type + signatures)
- Users (ADMIN/OWNER)
- Organizations (ADMIN create)

## Notes

JSON fields (`deedInfo`, `facilities`, `termsAndConditions`) are edited as JSON in v1 and match the backend Swagger examples.
