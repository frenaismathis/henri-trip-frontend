# HenriTrip Frontend

Frontend Angular Development for a Fullstack Web Project with an Application-Oriented Focus, Close to Professional Contexts.

## Description
Angular application connected to a REST backend (Java / .NET) for managing travel guides. Modular, responsive, and maintainable architecture, following professional best practices.

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Build and Run](#build-and-run)
- [Running with Docker](#running-with-docker)
- [Folder Structure](#folder-structure)
- [Routing](#routing)
- [Services and State Management](#services-and-state-management)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Technologies

- Angular 17
- Angular Material
- TailwindCSS
- SCSS
- TypeScript
- Node.js 20
- Docker & Docker Compose

## Features

- Authentication with JWT
- Login page and route protection via AuthGuard
- CRUD interaction with backend APIs
- Feature modules: auth, guides, activities
- Core services, interceptors, and enums
- Shared components: navbar, models
- Responsive UI with TailwindCSS
- Modular and scalable Angular architecture

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Angular CLI
- Docker (optional for containerized setup)

### Clone the repository

```sh
git clone https://github.com/yourusername/henri-trip-frontend.git
cd henri-trip-frontend
```

## Configuration

Update environment variables in [src/environments/environment.ts](src/environments/environment.ts) for API endpoints or other configurations.  
For example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
};
```

## Build and Run

Install dependencies:

```sh
npm install
```

Run development server:

```sh
ng serve --open
```

The app will be available at [http://localhost:4200](http://localhost:4200)

Build for production:

```sh
ng build --project henri-trip-frontend --configuration production
```

## Running with Docker

Build the Docker image:

```sh
docker build -t henri-trip-frontend .
```

Run the container:

```sh
docker run -p 4200:4200 henri-trip-frontend
```

Or use Docker Compose:

```sh
docker-compose up --build
```

## Folder Structure

- `src/app/core` – Core services, interceptors, guards, enums
- `src/app/features/auth` – Login component and authentication module
- `src/app/features/guides` – Guide list and detail components
- `src/app/features/activities` – Activity detail component
- `src/app/shared` – Shared components (navbar, models)
- `src/environments` – Environment configurations

## Routing

Routes are defined in [src/app/app.routes.ts](src/app/app.routes.ts) and protected with AuthGuard.  
Example:

- `/login` – Login page
- `/guides` – Guide list
- `/guides/:id` – Guide detail
- `/guides/:guideId/activities/:activityId` – Activity detail

## Services and State Management

- [`AuthService`](src/app/core/services/auth.service.ts) – JWT authentication and token management
- [`GuideService`](src/app/core/services/guide.service.ts) – Fetch guides from backend
- Interceptors attach JWT token to HTTP requests

## Testing

Run unit tests:

```sh
ng test
```

Run end-to-end tests:

```sh
ng e2e
```

## Contributing

- Fork the repository
- Create a feature branch
- Commit changes with meaningful messages
- Push to your fork
- Open a Pull Request against develop
