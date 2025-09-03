# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack job search platform with a React frontend and Node.js/Express backend. The application allows users to browse jobs, save favorites, apply for positions, and manage their profiles. It uses PostgreSQL for data persistence and includes JWT authentication with bcrypt password hashing.

## Architecture

### Monorepo Structure
- `job-search-platform/` - React 19 RC frontend with TypeScript, Vite, Tailwind CSS
- `job-search-backend/` - Node.js/Express backend with TypeScript, PostgreSQL

### Key Architectural Decisions

**Authentication Flow:**
- Uses temporary token system (not production-ready JWT) for demo purposes
- Frontend stores tokens in localStorage/sessionStorage 
- Context-aware 401 handling: login failures show errors, expired tokens clear storage and redirect
- Token validation happens during auth context initialization

**Database Design:**
- PostgreSQL with UUID primary keys for all entities
- Normalized schema: users → user_profiles, companies → jobs, users → applications/saved_jobs
- UUID extension enabled for primary key generation

**API Design:**
- RESTful endpoints with consistent `ApiResponse<T>` wrapper
- Protected routes use authentication middleware
- Rate limiting (development: 1000 req/15min, production: 100 req/15min)
- CORS configured for localhost:5173 (frontend) and localhost:3000

## Development Commands

### Backend (job-search-backend/)
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled production build
npm run setup        # Initialize database schema and seed data
npm run migrate      # Run database migrations only
npm run seed         # Seed data only
```

### Frontend (job-search-platform/)
```bash
npm run dev          # Start Vite development server (localhost:5173)
npm run build        # Build production bundle
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Database Setup

The backend includes comprehensive database management:

1. **Initial Setup:** `npm run setup` - Creates tables and seeds demo data
2. **Schema Management:** SQL schema defined in `src/scripts/migrate.ts`
3. **Demo Data:** Includes 3 demo users and 10 job listings via `seedData.ts`

**Demo Credentials:**
- Email: john.doe@example.com
- Password: password123

## Environment Configuration

Backend requires `.env` file (copy from `.env.example`):
```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_search_platform  
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## Key Components & Services

### Frontend Service Layer
- `api.ts` - Centralized HTTP client with auth headers and error handling
- `authService.ts` - Authentication operations with token validation
- `jobsService.ts` - Job-related API calls (search, save, unsave)
- `applicationsService.ts` - Application tracking functionality

### Backend Route Structure
- `/api/auth/*` - Authentication (login, register, profile)
- `/api/jobs/*` - Job listings, search, save/unsave operations
- `/api/applications/*` - Job application tracking
- `/api/users/*` - User profile management

### Authentication Context
React Context pattern manages global auth state with reducer:
- Handles login/logout actions
- Provides authentication status to components
- Validates tokens on app initialization
- Supports "Remember me" functionality

### Protected Routes
`ProtectedRoute` component wraps authenticated pages:
- Shows loading spinner during auth initialization  
- Redirects to login with return URL for unauthenticated users
- Prevents component mounting until authentication resolved

## Development Notes

### Token System
**IMPORTANT:** The current system uses temporary tokens (`temp_token_${userId}_${timestamp}`) which is NOT production-ready. This is for demo purposes only and should be replaced with proper JWT implementation.

### Error Handling
The API client includes sophisticated 401 handling:
- Login/register failures: Show error message only
- Other 401s (expired tokens): Clear storage and redirect to login
- This prevents authentication loops and improves UX

### Database Seeding
When running `npm run setup`, the system:
1. Drops and recreates all tables
2. Seeds demo users with hashed passwords
3. Seeds job listings with company information
4. Creates user profiles for demo accounts

### Styling
Frontend uses Tailwind CSS v4 beta with:
- Responsive design patterns
- Consistent color scheme (blue primary, gray neutrals)
- Component-based styling approach
- Loading states and skeleton components

## Troubleshooting

**401 Errors:** If dashboard shows 401s, auth tokens may be invalid/expired. Login again or run `npm run setup` to reset database.

**CORS Issues:** Ensure backend CORS allows frontend origin (localhost:5173 for dev).

**Database Connection:** Verify PostgreSQL is running and credentials in `.env` match your setup.