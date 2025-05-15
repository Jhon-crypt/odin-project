# Next.js + Go/Gin Full Stack Application

This is a full-stack application using Next.js for the frontend and Go with Gin framework for the backend.

## Prerequisites

- Node.js (v18 or later)
- Go (v1.16 or later)
- npm (comes with Node.js)

## Project Structure

```
.
├── frontend/          # Next.js frontend application
└── main.go           # Go backend server
```

## Getting Started

1. Clone the repository
2. Install Go dependencies:
   ```bash
   go mod tidy
   ```

3. Start the application:
   ```bash
   go run main.go
   ```

This will start both the backend server (on port 8080) and the frontend development server (on port 3000) concurrently.

## Development

- Backend API is available at `http://localhost:8080`
- Frontend is available at `http://localhost:3000`

## Features

- Go/Gin backend with API endpoints
- Next.js frontend with TypeScript
- TailwindCSS for styling
- Full-stack health check example
- CORS configuration
- Concurrent development servers 