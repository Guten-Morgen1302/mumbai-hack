# MumbaiHacks AI Health - Future Healthcare Technology Platform

## Overview

MumbaiHacks AI Health is a comprehensive futuristic hackathon project showcasing next-generation healthcare technology. The platform combines AI-powered surge management, patient journey optimization, AR vision capabilities, and intelligent healthcare advisory services. Built as a sophisticated multi-page web application with glassmorphic design and advanced interactive features, it demonstrates cutting-edge web development while presenting an impressive hackathon solution for healthcare innovation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with custom glassmorphism design system featuring neon gradients and dark mode
- **UI Components**: Radix UI primitives with custom shadcn/ui components for consistent, accessible interface
- **Routing**: Multi-page application using Wouter for lightweight client-side routing
- **Pages**: Multi-page application with Home (/), Dashboard (/dashboard), Simulator (/simulator), Advisory (/advisory), Map (/map), Patient Journey (/patient-journey), and AR Vision (/ar-vision)
- **State Management**: TanStack Query for server state management and caching
- **Animation**: CSS-based animations for glassmorphic effects, hover states, and real-time data updates

### Backend Architecture
- **Framework**: Express.js with TypeScript for API endpoints
- **Architecture Pattern**: RESTful API design with modular route handlers
- **Storage Layer**: In-memory storage with interface abstraction for future database integration
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Development Server**: Vite integration for hot module replacement and development tooling

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema**: Four main entities - hospitals, surge data, health advisories, and AI predictions
- **Provider**: Neon Database (@neondatabase/serverless) for PostgreSQL hosting
- **Migration**: Drizzle Kit for schema migrations and database management

### Data Models
- **Hospitals**: Location data, bed availability, ICU capacity, status tracking
- **Surge Data**: Patient inflow predictions, AI confidence scores, timestamps
- **Health Advisories**: AQI alerts, medical advisories, severity levels
- **AI Predictions**: Surge forecasts, staffing recommendations, supply alerts

### UI/UX Design System
- **Theme**: Dark mode with glassmorphism (frosted glass effects)
- **Color Palette**: Neon cyan, purple, and blue accents on dark backgrounds
- **Typography**: Inter font family for clean, modern readability
- **Animations**: Glow effects, hover states, and smooth transitions
- **Responsive**: Mobile-first design with breakpoint-specific layouts

### Component Architecture
- **Glass Cards**: Reusable glassmorphic container components
- **Dashboard Widgets**: Modular components for different data visualizations
- **Real-time Updates**: Simulated live data with periodic refresh mechanisms
- **Interactive Maps**: Mumbai hospital locations with status indicators

### Build & Development
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Asset Handling**: Vite asset optimization and static file serving
- **Development**: Hot reload with error overlay and development tools

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms)
- **Lucide React**: Modern icon library
- **Class Variance Authority**: Type-safe component variants

### Database & Validation
- **Drizzle ORM**: Type-safe database queries and schema management
- **Neon Database**: Serverless PostgreSQL provider
- **Zod**: Runtime type validation and schema definitions

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for development

### Utility Libraries
- **Date-fns**: Date manipulation and formatting
- **CLSX**: Conditional CSS class composition
- **Nanoid**: Unique ID generation

### Form & Input Handling
- **React Hook Form**: Form state management
- **Hookform Resolvers**: Zod integration for form validation

The application is designed to showcase modern web development practices while creating an impressive demonstration of AI-powered healthcare management for hackathon judges.