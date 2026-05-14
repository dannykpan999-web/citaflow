# CitaFlow

WhatsApp appointment automation SaaS for clinics and aesthetic businesses.

## Architecture

```
citaflow/
├── apps/
│   ├── web/    # Next.js 14 — landing page + dashboard
│   └── api/    # NestJS   — REST API + WhatsApp integration
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Backend | NestJS (Node.js) |
| Database | PostgreSQL 15 |
| Queue | BullMQ + Redis |
| WhatsApp | Meta Cloud API |
| Server | Ubuntu 22.04 · Nginx · PM2 · Certbot |

## Getting Started

### Prerequisites
- Node.js >= 20
- PostgreSQL 15
- Redis 7

### Setup

```bash
# Install dependencies
npm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Run database migrations
cd apps/api && npm run migration:run

# Start development
npm run dev
```

### Environment Variables

See `apps/api/.env.example` and `apps/web/.env.example` for required variables.

## Deployment

See `/docs/deployment.md` for VPS deployment guide (Ubuntu 22.04 + Nginx + PM2).

## Phase 1 Features

- Multi-tenant JWT authentication (super_admin / owner / agent)
- Meta WhatsApp Cloud API — webhook, auto-reply, lead creation
- Landing page — fully responsive, light mode
- PostgreSQL schema with full tenant isolation

## License

Private — All rights reserved.
