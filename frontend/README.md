# Tourism Explorer - Frontend

A modern Angular-based single-page application (SPA) for the Tourism Explorer platform. This frontend provides an intuitive and interactive user interface for tourists and tour operators to explore, create, and manage tourism experiences, complete with gamification elements and real-time map integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Configuration](#configuration)
- [UI Components](#ui-components)
- [Contributing](#contributing)

## 🎯 Overview

The Tourism Explorer frontend is a feature-rich Angular application that enables users to:

- Browse and discover tourist tours and destinations
- Create and manage personalized tours with checkpoints
- Track tour execution with real-time GPS and mapping
- Engage with interactive challenges and encounters
- Participate in mini-games for rewards
- Manage blog posts and share travel experiences
- Process payments and manage wallets
- View analytics and statistics with interactive charts

## 🛠 Technology Stack

- **Framework**: Angular 16.2.12
- **Language**: TypeScript 5.1.3
- **UI Components**: 
  - Angular Material 16.2.12
  - Bootstrap 5.3.3
  - ng-bootstrap 15.1.2
- **Maps**: Leaflet 1.9.4 with Routing Machine
- **Charts**: ngx-echarts 15.0.3 (Apache ECharts)
- **Icons**: Font Awesome 6.6+
- **Markdown**: ngx-markdown 19.0.0
- **Authentication**: @auth0/angular-jwt 5.1.2
- **Internationalization**: @ngx-translate 16.0.3
- **Testing**: Jasmine, Karma
- **Build Tool**: Angular CLI with Webpack 5

## ✨ Features

### 🗺 Tour Management
- **Tour Authoring**: Create tours with multiple checkpoints, descriptions, and media
- **Tour Execution**: Real-time GPS tracking and turn-by-turn navigation
- **Interactive Maps**: Leaflet-based maps with custom markers and routing
- **Checkpoint Management**: Add, edit, and organize tour stops

### 🎮 Gamification
- **Mini-Games**: Integrated arcade games including:
  - Space Invaders
  - Tetris
  - Lights Out
  - Memory Game
  - Mastermind
- **Challenges & Encounters**: Interactive tasks and quizzes during tours
- **Rewards System**: Points and achievements for completing activities

### 📝 Blog & Content
- **Blog Platform**: Create, edit, and publish travel stories
- **Markdown Support**: Rich text editing with markdown support
- **Media Gallery**: Image and video uploads
- **Social Interaction**: Comments and reactions

### 💳 Payments & Marketplace
- **Wallet Management**: Digital wallet for tour payments
- **Marketplace**: Browse and purchase tours and experiences
- **Transaction History**: View payment records and receipts

### 📊 Analytics & Visualization
- **Interactive Charts**: ECharts-powered data visualizations
- **Statistics Dashboard**: Tour performance and user engagement metrics
- **Reports**: Exportable analytics reports

### 👤 User Management
- **Authentication**: JWT-based secure login and registration
- **User Profiles**: Customizable tourist and author profiles
- **Role-Based Access**: Different views for tourists, authors, and administrators
- **Administration Panel**: User and content management for admins

## 🏗 Architecture

The application follows Angular best practices with a modular, feature-based architecture:

### Application Layers

1. **Feature Modules** (`feature-modules/`)
   - Self-contained feature sets with components, services, and routing
   - Lazy-loaded for optimal performance
   - Each module represents a bounded context

2. **Infrastructure** (`infrastructure/`)
   - HTTP interceptors for authentication
   - API service wrappers
   - Error handling and logging
   - Route guards and resolvers

3. **Shared** (`shared/`)
   - Reusable UI components
   - Common directives and pipes
   - Shared models and interfaces
   - Utility functions

### Design Patterns

- **Component-Based Architecture**: Composable, reusable UI components
- **Service Layer Pattern**: Business logic separated from presentation
- **Observable Pattern**: RxJS for reactive data flow
- **Lazy Loading**: Route-based code splitting for performance
- **Dependency Injection**: Angular's built-in DI for loose coupling

## 📁 Project Structure

```
Explorer/                           # Main Angular application
├── src/
│   ├── app/
│   │   ├── feature-modules/       # Feature-specific modules
│   │   │   ├── administration/    # Admin panel
│   │   │   ├── blog/              # Blog functionality
│   │   │   ├── tour-authoring/    # Tour creation
│   │   │   ├── tour-execution/    # Tour tracking
│   │   │   ├── marketplace/       # Shopping and payments
│   │   │   ├── game-menu/         # Game launcher
│   │   │   ├── space-invaders/    # Arcade games
│   │   │   ├── tetris/
│   │   │   ├── lights-out/
│   │   │   ├── memory-game/
│   │   │   ├── mastermind/
│   │   │   └── layout/            # App layout and navigation
│   │   │
│   │   ├── infrastructure/        # Core services
│   │   │   ├── auth/              # Authentication
│   │   │   ├── routing/           # Route configuration
│   │   │   └── rest/              # HTTP client services
│   │   │
│   │   ├── shared/                # Shared resources
│   │   │   ├── model/             # TypeScript interfaces/models
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── directives/        # Custom directives
│   │   │   └── pipes/             # Custom pipes
│   │   │
│   │   ├── app.component.*        # Root component
│   │   └── app.module.ts          # Root module
│   │
│   ├── assets/                    # Static assets
│   │   ├── images/
│   │   ├── i18n/                  # Translation files
│   │   └── styles/
│   │
│   ├── env/                       # Environment configs
│   ├── index.html                 # Main HTML file
│   ├── main.ts                    # Bootstrap file
│   └── styles.css                 # Global styles
│
├── angular.json                   # Angular CLI config
├── package.json                   # npm dependencies
├── tsconfig.json                  # TypeScript config
└── karma.conf.js                  # Test configuration
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or v18.x LTS recommended)
- [npm](https://www.npmjs.com/) (v8.x or later, comes with Node.js)
- [Git](https://git-scm.com/)
- Code editor: [VS Code](https://code.visualstudio.com/) recommended

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bgdj11/tourism-explorer.git
   cd tourism-explorer/frontend/Explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Edit environment files in `src/env/` to point to your backend API:
   ```typescript
   // src/env/environment.ts
   export const environment = {
     production: false,
     apiHost: 'http://localhost:5001',
     // other settings...
   };
   ```

## ▶️ Running the Application

### Development Server

```bash
npm start
```

Or:
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Development Server with Custom Port

```bash
ng serve --port 4300
```

### Development Server with Host Binding (for network access)

```bash
ng serve --host 0.0.0.0
```

## 🔨 Building for Production

### Production Build

```bash
npm run build
```

Or:
```bash
ng build
```

The build artifacts will be stored in the `dist/explorer/` directory.

### Build with Configuration

```bash
ng build --configuration production
```

### Analyze Bundle Size

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/explorer/stats.json
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

Or:
```bash
ng test
```

This executes the unit tests via [Karma](https://karma-runner.github.io) with Jasmine framework.

### Run Tests in Headless Mode (CI/CD)

```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Code Coverage

```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

## ⚙️ Configuration

### Environment Files

- `src/env/environment.ts` - Development configuration
- `src/env/environment.prod.ts` - Production configuration

Key settings:
```typescript
export const environment = {
  production: false,
  apiHost: 'http://localhost:5001',        // Backend API URL
  jwtTokenKey: 'jwt-token',                // Local storage key for JWT
  mapTilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  defaultLanguage: 'en',
  // ... other configs
};
```

### Proxy Configuration (optional)

To avoid CORS issues during development, create `proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:5001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Run with proxy:
```bash
ng serve --proxy-config proxy.conf.json
```

## 🎨 UI Components

### Material Design Components

The app uses Angular Material for consistent UI/UX:
- `mat-toolbar` - Navigation bars
- `mat-card` - Content containers
- `mat-button` - Action buttons
- `mat-form-field` - Input fields
- `mat-dialog` - Modal dialogs
- `mat-table` - Data tables
- `mat-paginator` - Pagination

### Bootstrap Components

Bootstrap 5 provides additional styling and layout:
- Grid system for responsive layouts
- Utility classes for spacing and alignment
- Modal dialogs and alerts
- Forms and form validation

### Custom Components

Key shared components (`shared/components/`):
- Navigation bars and menus
- Map components with Leaflet integration
- Chart components with ECharts
- Form builders and validators
- Media upload widgets

## 🗺️ Maps Integration

The application uses Leaflet for interactive mapping:

```typescript
import * as L from 'leaflet';
import 'leaflet-routing-machine';

// Initialize map
const map = L.map('map').setView([lat, lng], zoom);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add routing
L.Routing.control({
  waypoints: [
    L.latLng(start),
    L.latLng(end)
  ]
}).addTo(map);
```

## 🌐 Internationalization (i18n)

The app supports multiple languages using `@ngx-translate`:

Translation files are located in `src/assets/i18n/`:
- `en.json` - English
- `sr.json` - Serbian
- (add more as needed)

Usage in components:
```typescript
this.translate.use('en');
this.translate.get('KEY').subscribe(value => {
  console.log(value);
});
```

Usage in templates:
```html
<h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
```

## 🔐 Authentication

JWT-based authentication is handled via `@auth0/angular-jwt`:

```typescript
// HTTP interceptor automatically attaches token
{
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
}
```

Token is stored in localStorage with the key defined in environment config.

## 🚀 Performance Optimizations

- **Lazy Loading**: Feature modules loaded on-demand
- **OnPush Change Detection**: Used in performance-critical components
- **Track By Functions**: Optimized *ngFor loops
- **Pure Pipes**: Memoized transformations
- **Production Build**: Ahead-of-Time (AOT) compilation, tree-shaking, minification

## 🤝 Contributing

### Development Workflow

1. Create a feature branch from `development`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following Angular style guide

3. Run linter (if configured):
   ```bash
   ng lint
   ```

4. Ensure all tests pass:
   ```bash
   npm test
   ```

5. Commit with clear messages:
   ```bash
   git commit -m "feat: add new tour filter component"
   ```

6. Push and create a pull request

### Code Style

- Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- Use TypeScript strict mode
- Write unit tests for components and services
- Document complex logic with comments
- Use meaningful variable and function names

### Component Naming Convention

- Components: `feature-name.component.ts`
- Services: `feature-name.service.ts`
- Models: `feature-name.model.ts`
- Modules: `feature-name.module.ts`

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Leaflet Documentation](https://leafletjs.com/)
- [ECharts Documentation](https://echarts.apache.org/)
- [Bootstrap Documentation](https://getbootstrap.com/)

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm install` fails with peer dependency errors
```bash
npm install --legacy-peer-deps
```

**Issue**: Map tiles not loading
- Check internet connection
- Verify Leaflet CSS is imported in `angular.json`

**Issue**: Angular CLI commands not found
```bash
npm install -g @angular/cli
```

**Issue**: Port 4200 already in use
```bash
ng serve --port 4300
```

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

---

**[← Back to Main Documentation](../README.md)** | **[Backend Documentation →](../src/README.md)** - Frontend

A modern Angular-based single-page application (SPA) for the Tourism Explorer platform. This frontend provides an intuitive and interactive user interface for tourists and tour operators to explore, create, and manage tourism experiences, complete with gamification elements and real-time map integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Configuration](#configuration)
- [UI Components](#ui-components)
- [Contributing](#contributing)

## 🎯 Overview

The Tourism Explorer frontend is a feature-rich Angular application that enables users to:

- Browse and discover tourist tours and destinations
- Create and manage personalized tours with checkpoints
- Track tour execution with real-time GPS and mapping
- Engage with interactive challenges and encounters
- Participate in mini-games for rewards
- Manage blog posts and share travel experiences
- Process payments and manage wallets
- View analytics and statistics with interactive charts

## 🛠 Technology Stack

- **Framework**: Angular 16.2.12
- **Language**: TypeScript 5.1.3
- **UI Components**: 
  - Angular Material 16.2.12
  - Bootstrap 5.3.3
  - ng-bootstrap 15.1.2
- **Maps**: Leaflet 1.9.4 with Routing Machine
- **Charts**: ngx-echarts 15.0.3 (Apache ECharts)
- **Icons**: Font Awesome 6.6+
- **Markdown**: ngx-markdown 19.0.0
- **Authentication**: @auth0/angular-jwt 5.1.2
- **Internationalization**: @ngx-translate 16.0.3
- **Testing**: Jasmine, Karma
- **Build Tool**: Angular CLI with Webpack 5

## ✨ Features

### 🗺 Tour Management
- **Tour Authoring**: Create tours with multiple checkpoints, descriptions, and media
- **Tour Execution**: Real-time GPS tracking and turn-by-turn navigation
- **Interactive Maps**: Leaflet-based maps with custom markers and routing
- **Checkpoint Management**: Add, edit, and organize tour stops

### 🎮 Gamification
- **Mini-Games**: Integrated arcade games including:
  - Space Invaders
  - Tetris
  - Lights Out
  - Memory Game
  - Mastermind
- **Challenges & Encounters**: Interactive tasks and quizzes during tours
- **Rewards System**: Points and achievements for completing activities

### 📝 Blog & Content
- **Blog Platform**: Create, edit, and publish travel stories
- **Markdown Support**: Rich text editing with markdown support
- **Media Gallery**: Image and video uploads
- **Social Interaction**: Comments and reactions

### 💳 Payments & Marketplace
- **Wallet Management**: Digital wallet for tour payments
- **Marketplace**: Browse and purchase tours and experiences
- **Transaction History**: View payment records and receipts

### 📊 Analytics & Visualization
- **Interactive Charts**: ECharts-powered data visualizations
- **Statistics Dashboard**: Tour performance and user engagement metrics
- **Reports**: Exportable analytics reports

### 👤 User Management
- **Authentication**: JWT-based secure login and registration
- **User Profiles**: Customizable tourist and author profiles
- **Role-Based Access**: Different views for tourists, authors, and administrators
- **Administration Panel**: User and content management for admins

## 🏗 Architecture

The application follows Angular best practices with a modular, feature-based architecture:

### Application Layers

1. **Feature Modules** (`feature-modules/`)
   - Self-contained feature sets with components, services, and routing
   - Lazy-loaded for optimal performance
   - Each module represents a bounded context

2. **Infrastructure** (`infrastructure/`)
   - HTTP interceptors for authentication
   - API service wrappers
   - Error handling and logging
   - Route guards and resolvers

3. **Shared** (`shared/`)
   - Reusable UI components
   - Common directives and pipes
   - Shared models and interfaces
   - Utility functions

### Design Patterns

- **Component-Based Architecture**: Composable, reusable UI components
- **Service Layer Pattern**: Business logic separated from presentation
- **Observable Pattern**: RxJS for reactive data flow
- **Lazy Loading**: Route-based code splitting for performance
- **Dependency Injection**: Angular's built-in DI for loose coupling

## 📁 Project Structure

```
psw-fe-ra-2024-group-8/
├── Explorer/                           # Main Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── feature-modules/       # Feature-specific modules
│   │   │   │   ├── administration/    # Admin panel
│   │   │   │   ├── blog/              # Blog functionality
│   │   │   │   ├── tour-authoring/    # Tour creation
│   │   │   │   ├── tour-execution/    # Tour tracking
│   │   │   │   ├── marketplace/       # Shopping and payments
│   │   │   │   ├── game-menu/         # Game launcher
│   │   │   │   ├── space-invaders/    # Arcade games
│   │   │   │   ├── tetris/
│   │   │   │   ├── lights-out/
│   │   │   │   ├── memory-game/
│   │   │   │   ├── mastermind/
│   │   │   │   └── layout/            # App layout and navigation
│   │   │   │
│   │   │   ├── infrastructure/        # Core services
│   │   │   │   ├── auth/              # Authentication
│   │   │   │   ├── routing/           # Route configuration
│   │   │   │   └── rest/              # HTTP client services
│   │   │   │
│   │   │   ├── shared/                # Shared resources
│   │   │   │   ├── model/             # TypeScript interfaces/models
│   │   │   │   ├── components/        # Reusable UI components
│   │   │   │   ├── directives/        # Custom directives
│   │   │   │   └── pipes/             # Custom pipes
│   │   │   │
│   │   │   ├── app.component.*        # Root component
│   │   │   └── app.module.ts          # Root module
│   │   │
│   │   ├── assets/                    # Static assets
│   │   │   ├── images/
│   │   │   ├── i18n/                  # Translation files
│   │   │   └── styles/
│   │   │
│   │   ├── env/                       # Environment configs
│   │   ├── index.html                 # Main HTML file
│   │   ├── main.ts                    # Bootstrap file
│   │   └── styles.css                 # Global styles
│   │
│   ├── angular.json                   # Angular CLI config
│   ├── package.json                   # npm dependencies
│   ├── tsconfig.json                  # TypeScript config
│   └── karma.conf.js                  # Test configuration
│
├── README.md
└── LICENSE

```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or v18.x LTS recommended)
- [npm](https://www.npmjs.com/) (v8.x or later, comes with Node.js)
- [Git](https://git-scm.com/)
- Code editor: [VS Code](https://code.visualstudio.com/) recommended

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kzi-nastava/psw-fe-ra-2024-group-8.git
   cd psw-fe-ra-2024-group-8/Explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Edit environment files in `src/env/` to point to your backend API:
   ```typescript
   // src/env/environment.ts
   export const environment = {
     production: false,
     apiHost: 'http://localhost:5001',
     // other settings...
   };
   ```

## ▶️ Running the Application

### Development Server

```bash
npm start
```

Or:
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Development Server with Custom Port

```bash
ng serve --port 4300
```

### Development Server with Host Binding (for network access)

```bash
ng serve --host 0.0.0.0
```

## 🔨 Building for Production

### Production Build

```bash
npm run build
```

Or:
```bash
ng build
```

The build artifacts will be stored in the `dist/explorer/` directory.

### Build with Configuration

```bash
ng build --configuration production
```

### Analyze Bundle Size

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/explorer/stats.json
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

Or:
```bash
ng test
```

This executes the unit tests via [Karma](https://karma-runner.github.io) with Jasmine framework.

### Run Tests in Headless Mode (CI/CD)

```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Code Coverage

```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

## ⚙️ Configuration

### Environment Files

- `src/env/environment.ts` - Development configuration
- `src/env/environment.prod.ts` - Production configuration

Key settings:
```typescript
export const environment = {
  production: false,
  apiHost: 'http://localhost:5001',        // Backend API URL
  jwtTokenKey: 'jwt-token',                // Local storage key for JWT
  mapTilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  defaultLanguage: 'en',
  // ... other configs
};
```

### Proxy Configuration (optional)

To avoid CORS issues during development, create `proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:5001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Run with proxy:
```bash
ng serve --proxy-config proxy.conf.json
```

## 🎨 UI Components

### Material Design Components

The app uses Angular Material for consistent UI/UX:
- `mat-toolbar` - Navigation bars
- `mat-card` - Content containers
- `mat-button` - Action buttons
- `mat-form-field` - Input fields
- `mat-dialog` - Modal dialogs
- `mat-table` - Data tables
- `mat-paginator` - Pagination

### Bootstrap Components

Bootstrap 5 provides additional styling and layout:
- Grid system for responsive layouts
- Utility classes for spacing and alignment
- Modal dialogs and alerts
- Forms and form validation

### Custom Components

Key shared components (`shared/components/`):
- Navigation bars and menus
- Map components with Leaflet integration
- Chart components with ECharts
- Form builders and validators
- Media upload widgets

## 🗺️ Maps Integration

The application uses Leaflet for interactive mapping:

```typescript
import * as L from 'leaflet';
import 'leaflet-routing-machine';

// Initialize map
const map = L.map('map').setView([lat, lng], zoom);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add routing
L.Routing.control({
  waypoints: [
    L.latLng(start),
    L.latLng(end)
  ]
}).addTo(map);
```

## 🌐 Internationalization (i18n)

The app supports multiple languages using `@ngx-translate`:

Translation files are located in `src/assets/i18n/`:
- `en.json` - English
- `sr.json` - Serbian
- (add more as needed)

Usage in components:
```typescript
this.translate.use('en');
this.translate.get('KEY').subscribe(value => {
  console.log(value);
});
```

Usage in templates:
```html
<h1>{{ 'WELCOME_MESSAGE' | translate }}</h1>
```

## 🔐 Authentication

JWT-based authentication is handled via `@auth0/angular-jwt`:

```typescript
// HTTP interceptor automatically attaches token
{
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
}
```

Token is stored in localStorage with the key defined in environment config.

## 🚀 Performance Optimizations

- **Lazy Loading**: Feature modules loaded on-demand
- **OnPush Change Detection**: Used in performance-critical components
- **Track By Functions**: Optimized *ngFor loops
- **Pure Pipes**: Memoized transformations
- **Production Build**: Ahead-of-Time (AOT) compilation, tree-shaking, minification

## 🤝 Contributing

### Development Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following Angular style guide

3. Run linter (if configured):
   ```bash
   ng lint
   ```

4. Ensure all tests pass:
   ```bash
   npm test
   ```

5. Commit with clear messages:
   ```bash
   git commit -m "feat: add new tour filter component"
   ```

6. Push and create a pull request

### Code Style

- Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- Use TypeScript strict mode
- Write unit tests for components and services
- Document complex logic with comments
- Use meaningful variable and function names

### Component Naming Convention

- Components: `feature-name.component.ts`
- Services: `feature-name.service.ts`
- Models: `feature-name.model.ts`
- Modules: `feature-name.module.ts`

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Leaflet Documentation](https://leafletjs.com/)
- [ECharts Documentation](https://echarts.apache.org/)
- [Bootstrap Documentation](https://getbootstrap.com/)
