# nestjs-url-shortener

A NestJS REST API for creating, resolving, and analyzing short URLs.

## Requirements

- Node.js 20 or later
- MongoDB

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set the values for your environment.

3. Start the API:

   ```bash
   npm run start:dev
   ```

The health endpoint is available at `GET /health` and returns `{ "status": "ok" }`.

## API documentation

After starting the application, open [http://localhost:3000/api/docs](http://localhost:3000/api/docs) for the interactive Swagger UI and OpenAPI specification.

## API usage

Create a short URL:

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com/article"}'
```

Resolve a short URL with `GET /:shortCode`, or retrieve its analytics with `GET /api/urls/:shortCode/stats`.

## Commands

```bash
npm run build
npm run lint
npm run start
```
