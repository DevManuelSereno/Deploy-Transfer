# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 16 frontend application for vehicle transfer management (PASS project). It uses the Next.js App Router with TypeScript, React 19, and server components. The application manages vehicles, gas supplies, occurrences, and documentation.

## Commands

### Development
```powershell
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Quality
This project uses **Biome** for formatting and linting (not ESLint for formatting):
- Formatting: Tab indentation, double quotes
- Linting is enabled through both Biome and ESLint
- Configuration: `biome.json`

### Testing
This project does not currently have a test setup configured. Before adding tests, check with the team about the preferred testing framework.

## Architecture

### Directory Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── transfer/                 # Main transfer feature module
│   │   ├── components/           # Feature-specific components
│   │   │   ├── columns/          # TanStack Table column definitions
│   │   │   ├── form/             # Form components
│   │   │   ├── modal/            # Modal components
│   │   │   ├── table/            # Table components
│   │   │   └── tabs/             # Tab components
│   │   ├── context/              # React contexts (vehicle, gas-supply, occurrence, documentation, modal)
│   │   ├── hooks/                # Feature-specific hooks (form options)
│   │   ├── types/                # Feature-specific types
│   │   ├── validation/           # Zod validation schemas
│   │   └── page.tsx              # Transfer page route
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles with Tailwind
├── components/
│   ├── ui/                       # shadcn/ui components (Button, Table, etc.)
│   ├── navbar/                   # Navigation bar
│   └── sidebar/                  # Sidebar navigation
├── lib/
│   ├── api.ts                    # Axios instance configuration
│   ├── functions.api.ts          # Generic API functions (getData, postData, putData, deleteData)
│   ├── query-config.ts           # TanStack Query configuration
│   ├── sidebar-menu-list.ts      # Sidebar menu configuration
│   └── utils.ts                  # Utility functions (cn for className merging)
├── types/
│   ├── enums/                    # Prisma-generated enum schemas
│   └── models/                   # Zod schemas for API models (Vehicle, Company, Brand, etc.)
├── providers/                    # App-level providers (theme, query-client)
├── i18n/                         # Internationalization configuration
├── hooks/                        # Global custom hooks
└── assets/                       # Static assets (images)
```

### Technology Stack
- **Framework**: Next.js 16 (App Router, React Server Components)
- **UI Library**: React 19
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Internationalization**: next-intl (cookie-based locale storage)
- **API Client**: Axios
- **Code Quality**: Biome (formatting/linting) + ESLint (Next.js rules)

### Key Patterns

#### API Integration
- Backend API URL configured via `NEXT_PUBLIC_API_URL` environment variable (default: `http://localhost:4000`)
- Centralized Axios instance in `src/lib/api.ts` with ngrok header bypass
- Generic API functions in `src/lib/functions.api.ts`: `getData<T>`, `postData<T, TForm>`, `putData<T, TForm>`, `deleteData<T>`
- All API functions accept `signal` for request cancellation (important for React Query)
- Error handling via `toastErrorsApi` function using sonner toast

#### State Management
- **Server State**: TanStack Query with centralized config (`src/lib/query-config.ts`)
  - Queries: 3 retries, offline-first for mutations
  - Query keys pattern: `["entity-action"]` (e.g., `["vehicle-get"]`)
- **UI State**: React Context for feature modules (modal state, form editing)
- **Form State**: React Hook Form with Zod schemas in `validation/` directories

#### Component Organization
- **Feature-based structure**: Large features (like `transfer`) have their own directory under `app/` with components, contexts, hooks, types, and validation
- **Shared UI components**: `src/components/ui/` contains shadcn/ui components (styled with cva and Tailwind)
- **Path alias**: `@/*` maps to `src/*` (configured in `tsconfig.json`)

#### Forms and Validation
- Forms use React Hook Form with `@hookform/resolvers` for Zod integration
- Validation schemas in `validation/` directories (e.g., `validation-vehicle.ts`)
- Form options hooks: `use-*-form-options.ts` for dropdown/select options

#### Data Tables
- Built with TanStack Table v8
- Column definitions in `columns/` directories
- Custom `DataTable` component with toolbar and actions
- Pattern: columns accept action callbacks for edit/delete operations

#### Internationalization
- Uses `next-intl` with server-side locale detection
- Locale stored in cookies (not URL-based)
- Message files in `messages/` directory (currently only `en.json`)
- Access translations with `useTranslations` hook or `getLocale()` server function

#### Styling Conventions
- Uses Tailwind CSS with custom color system (CSS variables)
- Dark mode support via `next-themes`
- Component variants managed with `class-variance-authority` (cva)
- Utility function `cn()` for conditional className merging

## Environment Variables

Required environment variables:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Deployment

### Docker
- Multi-stage Dockerfile (Node.js build + Nginx serve)
- Note: The Dockerfile appears outdated (references `/app/build` instead of Next.js `.next/`)

### Google Cloud Platform
- Cloud Build configuration in `cloudbuild.yaml`
- Deploys to GKE cluster `pass-cluster` in `us-central1`
- Container registry: `gcr.io/pass-core/transfer-pass-app`
- Kubernetes configs in `k8s/` directory

## Code Style

### TypeScript
- Strict mode enabled
- Target: ES2017
- Use explicit types, avoid `any` (warns via Biome)

### Formatting (Biome)
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes
- **Import organization**: Automatic via Biome assist

### Component Patterns
- Use `"use client"` directive only when necessary (forms, hooks, contexts)
- Prefer server components for data fetching when possible
- Export named functions for components
- Use `React.ComponentProps<"element">` for component prop types

### Forms
- Always use React Hook Form with Zod validation
- Form schemas should be in `validation/` directory
- Use `@hookform/resolvers/zod` for schema integration

### API Calls
- Always pass `signal` from React Query to API functions for cancellation support
- Use generic type parameters: `getData<VehicleData[]>`, `postData<Response, FormData>`
- Handle errors with `toastErrorsApi` utility

### Imports
- Use `@/` path alias for all src imports
- Keep imports organized (Biome handles this automatically)

## Important Notes

- **Component Library**: This project uses shadcn/ui components from `@/components/ui/`. When adding new UI components, use shadcn/ui CLI or follow existing patterns.
- **API Models**: Type schemas in `src/types/models/` appear to be Prisma-generated. Do not manually edit these files.
- **Theme System**: Uses CSS variables for theming. Check `globals.css` for available color tokens.
- **Icons**: Uses `lucide-react` for icons
- **Animations**: Uses Framer Motion for complex animations

## Common Workflows

### Adding a New Feature Module
1. Create feature directory under `src/app/[feature-name]/`
2. Add subdirectories: `components/`, `context/`, `hooks/`, `types/`, `validation/`
3. Create `page.tsx` as the route entry point
4. Define Zod validation schemas in `validation/`
5. Create context providers for shared state in `context/`
6. Build feature-specific components

### Adding a New API Endpoint Integration
1. Define types/schemas in `src/types/models/` (or feature types)
2. Use generic API functions from `src/lib/functions.api.ts`
3. Create React Query hooks with proper query keys
4. Handle errors with `toastErrorsApi`

### Adding a New UI Component
1. If shadcn/ui component: use CLI or copy from shadcn/ui docs
2. Place in `src/components/ui/`
3. Use `cn()` utility for className merging
4. Follow existing patterns for variants (cva) and styling
