# AGENTS.md - PPDB Madrasah Aliyah

## Project Overview

PPDB (Penerimaan Peserta Didik Baru) Madrasah Aliyah - Student admissions system for Islamic senior high schools.

**Stack:** Laravel 13 (PHP 8.3+) + Inertia.js + React 18 + Tailwind CSS + Shadcn UI

## Critical Architecture Rule

**Single Responsibility Principle (SRP):** Models MUST NOT contain business logic. Only `$fillable`, `$casts`, and relationships are allowed in models. All business logic (scoring, quota calculation, file uploads) belongs in Controllers or Service Classes (`App\Services\`).

## Commands

```bash
# Full setup (first time)
composer setup

# Dev server (runs php artisan serve + queue + vite concurrently)
composer dev

# Run tests
composer test

# Run single test
php artisan test --filter=TestName
```

## Database

- Default: SQLite (`database/database.sqlite`)
- Tests use in-memory SQLite (`phpunit.xml`)
- Multi-table writes must use `DB::transaction()`

## Key Directories

- `app/Http/Controllers/` - All business logic lives here
- `app/Services/` - Complex services (ScoringService, RegistrationAssignmentService)
- `app/Models/` - Eloquent models (SRP-compliant only)
- `resources/js/Pages/` - React pages organized by role (Admin/, Operator/, Student/)
- `database/migrations/` - Schema definitions

## Role-Based Routing

| Prefix | Role | Middleware |
|--------|------|------------|
| `/admin` | admin | role:admin |
| `/operator` | operator | role:operator |
| `/student` | student | auth |
| `/daftar` | public | registration.open |

## PRD Reference

Development phases are defined in `prd.md`. Follow phases sequentially - do not skip ahead.
