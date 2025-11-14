# BizBudz - Student Business Learning Hub

## Overview

BizBudz is a student-focused business learning platform that connects aspiring entrepreneurs through live tutoring sessions, group study opportunities, curated courses, and a collaborative community. The application provides an educational hub where students can track their learning progress, attend scheduled sessions, share notes and resources, and explore successful student business stories.

The platform emphasizes a clean, modern, and approachable design with a focus on student engagement and educational growth through interactive features like session sign-ups, note sharing with likes/comments, and gamified learning progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 18+ with TypeScript for type-safe component development
- Wouter for lightweight client-side routing
- Vite as the build tool and development server for fast compilation and hot module replacement

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design principles adapted for educational context with student-friendly aesthetics
- Consistent spacing system using Tailwind units (4, 6, 8, 12, 16, 20)
- Custom color palette: soft blue primary (chart-1), orange/green accents (chart-2/chart-3), light backgrounds

**State Management**
- TanStack Query (React Query) for server state management and API data fetching
- Local component state for UI interactions
- Mock user system (MOCK_USER_ID) for simulating authenticated user behavior without full auth implementation

**Design System**
- Typography: Inter font family with clear hierarchy (text-4xl/5xl heroes, text-2xl/3xl sections, text-lg cards)
- Card-based layouts with rounded corners (rounded-lg/xl), subtle shadows (shadow-sm/md), and hover elevations
- Responsive grid layouts: 2-3 columns desktop, single column mobile
- Mobile-first responsive design using Tailwind breakpoints

### Backend Architecture

**Server Framework**
- Express.js REST API with TypeScript
- ESM (ES Modules) throughout the codebase for modern JavaScript syntax
- Custom logging middleware for request tracking and debugging
- JSON request body parsing with raw body preservation for webhook handling

**API Design Pattern**
- RESTful endpoints with conventional HTTP methods (GET, POST, DELETE)
- Resource-based URL structure (/api/users, /api/sessions, /api/notes)
- JSON responses with appropriate HTTP status codes
- Error handling with Zod validation for request schemas

**In-Memory Storage Layer**
- MemStorage class implementing IStorage interface for data persistence
- Map-based data structures for users, sessions, notes, likes, comments, and statistics
- Mock data generation for development and demonstration
- Interface-driven design allowing future database swap without API changes

### Data Storage Solutions

**Database Configuration**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- Database schema defined in shared/schema.ts with Drizzle table definitions
- Migration support through drizzle-kit

**Schema Design**
- Users table: id (UUID), name, email (unique), password, school, interests
- TypeScript interfaces for complex types: Session, SessionSignup, Note, Like, Comment, UserStats, Course, LearningPath
- Relational data modeling with foreign key relationships (userId, sessionId, noteId)

**Current Implementation**
- Hybrid approach: SQL schema defined but in-memory storage currently active
- Allows development without database provisioning while maintaining production-ready schema
- Storage layer abstraction enables seamless transition to PostgreSQL persistence

### Authentication and Authorization

**Current State**
- Mock authentication using hardcoded MOCK_USER_ID and MOCK_USER_NAME
- User registration endpoint (/api/users/register) with email uniqueness validation
- Password storage in schema (prepared for future bcrypt hashing)
- No session management or JWT tokens implemented yet

**Prepared Foundation**
- User schema includes password field for future authentication
- Email uniqueness constraint enforced
- Storage methods support user lookup by ID and email
- Registration flow validates input with Zod schemas

### External Dependencies

**UI & Component Libraries**
- @radix-ui/* (v1.x): Accessible component primitives for dialogs, dropdowns, tooltips, etc.
- tailwindcss: Utility-first CSS framework
- class-variance-authority: Type-safe variant management for components
- cmdk: Command palette component
- embla-carousel-react: Touch-friendly carousel component
- lucide-react: Icon library with tree-shaking support

**Data Management**
- @tanstack/react-query (v5.x): Server state management and caching
- drizzle-orm (v0.39): TypeScript ORM for database operations
- drizzle-zod: Zod schema generation from Drizzle tables
- zod: Runtime type validation

**Database & Backend**
- @neondatabase/serverless: Serverless PostgreSQL driver
- express: Web application framework
- connect-pg-simple: PostgreSQL session store (prepared for future use)

**Developer Tools**
- vite: Frontend build tool and dev server
- tsx: TypeScript execution for Node.js
- @replit plugins: Runtime error modal, cartographer, dev banner for Replit environment
- date-fns: Date manipulation and formatting

**Form Management**
- react-hook-form: Form state management
- @hookform/resolvers: Integration with validation libraries like Zod

### Build and Deployment

**Development**
- `npm run dev`: Runs Express server with tsx in development mode
- Vite middleware integrated with Express for HMR and asset serving
- TypeScript type checking with `npm run check`

**Production Build**
- `npm run build`: Bundles frontend with Vite and backend with esbuild
- Frontend outputs to dist/public
- Backend bundles to dist/index.js with external packages
- `npm start`: Runs production build

**Database Management**
- `npm run db:push`: Pushes Drizzle schema to PostgreSQL (requires DATABASE_URL)
- Migration files stored in ./migrations directory