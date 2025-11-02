# Tourism Explorer

A comprehensive full-stack tourism platform consisting of an ASP.NET Core backend and an Angular frontend. This monorepo contains both applications merged together while preserving complete commit history from both original repositories.

## 🌍 Overview

Tourism Explorer is a feature-rich application that enables:

- **Tour Management**: Create, explore, and manage tourist tours with interactive checkpoints
- **Real-time Navigation**: GPS-based tour tracking with map integration
- **Gamification**: Mini-games, challenges, and rewards system
- **Content Platform**: Blog posts and travel stories
- **Payment System**: Digital wallets and marketplace
- **Analytics**: Interactive charts and statistics dashboards

## 📁 Repository Structure

This repository is organized into two main parts:

```
tourism-explorer/
├── src/                      # Backend (ASP.NET Core)
│   ├── Explorer.API/         # Main API entry point
│   ├── BuildingBlocks/       # Shared components
│   ├── Modules/              # Feature modules
│   │   ├── Blog/
│   │   ├── Encounters/
│   │   ├── Stakeholders/
│   │   └── Tours/
│   └── Explorer.sln          # Solution file
│
├── frontend/                 # Frontend (Angular)
│   ├── Explorer/             # Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── feature-modules/
│   │   │   │   ├── infrastructure/
│   │   │   │   └── shared/
│   │   └── package.json
│   ├── README.md
│   └── LICENSE
│
└── README.md                 # This file
```

## 📚 Documentation

Detailed documentation for each part of the application:

### 🔧 Backend Documentation
**Location**: [`src/README.md`](./src/README.md)

The backend is an ASP.NET Core 7.0 application following Clean Architecture and Domain-Driven Design principles.

**Key Topics**:
- Architecture and design patterns
- Module structure (Tours, Stakeholders, Encounters, Payments, Blog, Games)
- API endpoints and Swagger documentation
- Database setup and migrations
- Running and testing the backend

**Technologies**: ASP.NET Core 7.0, Entity Framework Core, PostgreSQL, JWT, BCrypt

👉 [**Read Backend Documentation →**](./src/README.md)

### 🎨 Frontend Documentation
**Location**: [`frontend/README.md`](./frontend/README.md)

The frontend is an Angular 16 single-page application with a modular, feature-based architecture.

**Key Topics**:
- Angular architecture and components
- Feature modules (Tour Authoring, Tour Execution, Games, Blog, etc.)
- Map integration with Leaflet
- Charts and analytics with ECharts
- Authentication and routing
- Building and deployment

**Technologies**: Angular 16, TypeScript, Material Design, Bootstrap, Leaflet, ECharts

👉 [**Read Frontend Documentation →**](./frontend/README.md)

## 🚀 Quick Start

### Prerequisites

- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Node.js](https://nodejs.org/) (v16.x or v18.x LTS)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/bgdj11/tourism-explorer.git
cd tourism-explorer
```

### Running the Backend

```bash
# Navigate to API project
cd src/Explorer.API

# Restore packages
dotnet restore

# Update database connection in appsettings.Development.json
# Then apply migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at `https://localhost:7001` with Swagger UI at `https://localhost:7001/swagger`

### Running the Frontend

```bash
# Navigate to frontend
cd frontend/Explorer

# Install dependencies
npm install

# Configure API endpoint in src/env/environment.ts

# Start dev server
npm start
```

The app will be available at `http://localhost:4200`

## 🧪 Testing

### Backend Tests

```bash
cd src
dotnet test
```

### Frontend Tests

```bash
cd frontend/Explorer
npm test
```

## 🏗 Architecture Overview

### Backend Architecture

- **Clean Architecture** with clear separation of concerns
- **Domain-Driven Design** with bounded contexts
- **Modular Monolith** structure for scalability
- **Repository Pattern** for data access
- **CQRS-like** separation in use cases

### Frontend Architecture

- **Feature Module** pattern for code organization
- **Lazy Loading** for optimal performance
- **Reactive Programming** with RxJS
- **Component-Based** UI with Angular
- **Service Layer** for business logic

## 📊 Repository Statistics

- **Combined Commits**: 23,900+ commits from both repositories
- **Backend**: ASP.NET Core with 50+ modules and components
- **Frontend**: Angular with 12+ feature modules
- **Combined Size**: ~90 MB of source code and assets

## 🔗 Links

- **Repository**: [https://github.com/bgdj11/tourism-explorer](https://github.com/bgdj11/tourism-explorer)
- **Backend Documentation**: [`src/README.md`](./src/README.md)
- **Frontend Documentation**: [`frontend/README.md`](./frontend/README.md)

## 📄 License

This project contains code from two repositories, each with their own license terms. See LICENSE files in respective directories.

