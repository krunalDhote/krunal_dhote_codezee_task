# nestjs-url-shortener

A minimal NestJS REST API foundation for a URL shortener. URL-shortening functionality has not been implemented yet.

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

## Commands

```bash
npm run build
npm run lint
npm run start
```
