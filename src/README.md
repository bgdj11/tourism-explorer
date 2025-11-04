# Tourism Explorer - Backend

A comprehensive ASP.NET Core backend application for a tourism exploration platform. This project provides REST APIs, domain models, business logic, and infrastructure for managing tours, stakeholders, encounters, payments, blog posts, and games functionality.

## Table of Contents

- [Overview](#-overview)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](-running-the-application)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Database](#-database)
- [Contributing](#-contributing)

## Overview

The Tourism Explorer backend is built using a modular monolithic architecture following Clean Architecture principles. It manages:

- **Tours**: Creation, management, and exploration of tourist tours and checkpoints
- **Stakeholders**: User management, authentication, and authorization
- **Encounters**: Interactive challenges and tasks for tourists
- **Payments**: Payment processing and transaction management
- **Blog**: Content management for tourism-related blog posts
- **Games**: Gamification features and challenges

## Technology Stack

- **Framework**: ASP.NET Core 7.0
- **Language**: C# 11
- **ORM**: Entity Framework Core 7.0
- **Database**: PostgreSQL (configurable)
- **Authentication**: JWT (JSON Web Tokens) with BCrypt password hashing
- **Email**: MailKit for email functionality
- **API Documentation**: Swagger/OpenAPI (Swashbuckle)
- **Testing**: xUnit, Moq
- **Architecture Testing**: NetArchTest

## Architecture

This project follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles, organized into:

### Layers

1. **API Layer** (`Explorer.API`, `*.API` projects)
   - Controllers and DTOs
   - HTTP request/response handling
   - Swagger configuration
   - CORS and authentication setup

2. **Core Layer** (`*.Core` projects)
   - Domain entities and value objects
   - Business logic and use cases
   - Repository interfaces
   - Domain services
   - AutoMapper profiles

3. **Infrastructure Layer** (`*.Infrastructure` projects)
   - Repository implementations
   - Database contexts (EF Core)
   - Database migrations
   - External service integrations

4. **Building Blocks** (`Explorer.BuildingBlocks.*`)
   - Shared abstractions and utilities
   - Common base classes
   - Cross-cutting concerns

### Modules

The application is divided into distinct bounded contexts:

- **Blog** - Blog post management and commenting
- **Encounters** - Tourist encounters and challenges
- **Stakeholders** - User and authentication management
- **Tours** - Tour creation, equipment, and checkpoint management
- **Payments** - Payment processing and wallet management
- **Games** - Gamification and quiz functionality

## Project Structure

```
src/
├── Explorer.API/                    # Main API entry point
│   ├── Controllers/                 # API controllers
│   ├── Startup/                     # Startup configuration
│   ├── Program.cs                   # Application entry point
│   └── appsettings.json            # Configuration
│
├── BuildingBlocks/                  # Shared components
│   ├── Explorer.BuildingBlocks.Core/
│   ├── Explorer.BuildingBlocks.Infrastructure/
│   └── Explorer.BuildingBlocks.Tests/
│
├── Modules/                         # Feature modules
│   ├── Blog/
│   │   ├── Explorer.Blog.API/
│   │   ├── Explorer.Blog.Core/
│   │   ├── Explorer.Blog.Infrastructure/
│   │   └── Explorer.Blog.Tests/
│   ├── Encounters/
│   ├── Stakeholders/
│   └── Tours/
│
├── Explorer.Games.*/                # Games module
├── Explorer.Payments.*/             # Payments module
│
├── Explorer.Architecture.Tests/     # Architecture tests
└── Explorer.sln                     # Solution file
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0) or later
- [PostgreSQL](https://www.postgresql.org/download/) (or other supported database)
- [Git](https://git-scm.com/)
- IDE: [Visual Studio 2022](https://visualstudio.microsoft.com/), [Visual Studio Code](https://code.visualstudio.com/), or [JetBrains Rider](https://www.jetbrains.com/rider/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bgdj11/tourism-explorer.git
   cd tourism-explorer/src
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Configure the database connection**
   
   Edit `Explorer.API/appsettings.Development.json` and update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=tourism_explorer;Username=postgres;Password=yourpassword"
     }
   }
   ```

4. **Apply database migrations**
   ```bash
   cd Explorer.API
   dotnet ef database update
   ```

## Running the Application

### Development Mode

```bash
cd src/Explorer.API
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`

### Swagger UI

Once the application is running, navigate to:
```
https://localhost:7001/swagger
```

This provides interactive API documentation where you can test endpoints.

### Using Visual Studio

1. Open `src/Explorer.sln`
2. Set `Explorer.API` as the startup project
3. Press `F5` or click the "Run" button

## Testing

The project includes comprehensive unit, integration, and architecture tests.

### Run All Tests

```bash
cd src
dotnet test
```

### Run Tests for Specific Module

```bash
# Blog module tests
dotnet test Modules/Blog/Explorer.Blog.Tests/

# Games module tests
dotnet test Explorer.Games.Tests/

# Payments module tests
dotnet test Explorer.Payments.Tests/

# Architecture tests
dotnet test Explorer.Architecture.Tests/
```

### Test Coverage

Tests include:
- **Unit Tests**: Domain logic and use cases
- **Integration Tests**: Repository and database operations
- **Architecture Tests**: Enforcement of architectural rules and dependencies

## API Documentation

### Authentication

Most endpoints require JWT authentication. To authenticate:

1. **Register a new user** via `/api/users/register`
2. **Login** via `/api/users/login` to receive a JWT token
3. **Include the token** in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Main Endpoints

| Module       | Base Path              | Description                    |
|--------------|------------------------|--------------------------------|
| Tours        | `/api/tours`          | Tour management               |
| Encounters   | `/api/encounters`     | Challenge and encounter APIs  |
| Stakeholders | `/api/stakeholders`   | User and auth management      |
| Blog         | `/api/blog`           | Blog post operations          |
| Payments     | `/api/payments`       | Payment processing            |
| Games        | `/api/games`          | Gamification features         |

Detailed API documentation is available through Swagger UI when running in development mode.

## Database

### Entity Framework Migrations

The project uses EF Core Code-First migrations for database schema management.

#### Create a New Migration

```bash
cd src/Explorer.API
dotnet ef migrations add MigrationName
```

#### Apply Migrations

```bash
dotnet ef database update
```

#### Rollback Migration

```bash
dotnet ef database update PreviousMigrationName
```

### Database Seeding

Initial data seeding occurs automatically on application startup (see `Program.cs`). The seeding populates:
- Default user roles
- Sample tourist profiles
- Test data for development

## Contributing

### Branch Strategy

- `main` - production-ready code
- `development` - active development branch
- `feature/*` - feature branches
- `bugfix/*` - bug fix branches

### Code Style

- Follow C# coding conventions
- Use meaningful names for classes, methods, and variables
- Write XML documentation for public APIs
- Keep controllers thin; business logic belongs in Core layer

### Pull Request Process

1. Create a feature branch from `development`
2. Implement your changes with appropriate tests
3. Ensure all tests pass
4. Run architecture tests to verify design compliance
5. Submit a pull request to `development`

## Configuration

### Application Settings

Key configuration files:
- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Development overrides
- `appsettings.Production.json` - Production overrides (add as needed)

### Environment Variables

You can override settings using environment variables:
```bash
export ConnectionStrings__DefaultConnection="your-connection-string"
export JwtSettings__Secret="your-jwt-secret"
```

## Security

- Passwords are hashed using BCrypt
- JWT tokens for stateless authentication
- CORS is configured for allowed origins
- HTTPS enforced in production
- Input validation on all endpoints

## Dependencies

Major NuGet packages:
- `Microsoft.EntityFrameworkCore` - ORM
- `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL provider
- `BCrypt.Net-Next` - Password hashing
- `MailKit` - Email functionality
- `Swashbuckle.AspNetCore` - Swagger/OpenAPI
- `AutoMapper` - Object mapping
- `xUnit`, `Moq` - Testing

## License

This project is licensed under the terms specified in the LICENSE file.

---

**[← Back to Main Documentation](../README.md)** | **[Frontend Documentation →](../frontend/README.md)**
