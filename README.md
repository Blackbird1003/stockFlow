# stockFlow — Inventory Management System

A modern, full-stack inventory management web application built with Next.js, PostgreSQL, Prisma, and NextAuth.

## Features

- **Dashboard** — KPI stats, charts, and low-stock alerts
- **Inventory** — Full product CRUD, category management, search & filters
- **Reports** — Auto-generated analytics reports
- **Activity Logs** — Full audit trail of all inventory changes
- **Role-Based Access** — Admin (full access) and Staff (view + edit stock) roles
- **Authentication** — Secure login/register with hashed passwords

---

## Setup Guide

### Step 1: Install PostgreSQL

1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings (remember your password)
3. Open pgAdmin or SQL Shell (psql) and run:
   ```sql
   CREATE DATABASE stockflow;
   ```

**OR use a free cloud DB (no installation needed):**
- https://neon.tech — Free serverless PostgreSQL
- https://supabase.com — Free tier with GUI

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/stockflow"
NEXTAUTH_SECRET="any-random-32-character-string-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Apply Schema & Seed Data

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000

---

## Demo Credentials

| Role  | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | admin@stockflow.com     | Admin123!  |
| Staff | staff@stockflow.com     | Staff123!  |

---

## Role Permissions

| Feature              | Admin | Staff |
|----------------------|-------|-------|
| View Dashboard       | YES   | YES   |
| View Inventory       | YES   | YES   |
| Add Products         | YES   | YES   |
| Edit Products/Stock  | YES   | YES   |
| Delete Products      | YES   | NO    |
| Manage Categories    | YES   | NO    |
| Generate Reports     | YES   | NO    |
| Delete Reports       | YES   | NO    |
| View Activity Logs   | YES   | YES   |

---

## Database Commands

```bash
npm run db:generate    # Regenerate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed demo data
npm run db:studio      # Open Prisma Studio (GUI)
```

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v4
- **Styling**: TailwindCSS + ShadCN UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
