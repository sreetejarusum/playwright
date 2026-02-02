# Playwright TypeScript Automation Framework (Starter)

This repository contains a starter, enterprise-minded Playwright + TypeScript test framework. It includes:

- TypeScript configuration
- Playwright configuration (`playwright.config.ts`) with multiple browser projects
- Utilities for reading text/json/properties, Excel, encryption, random generators
- Database connectors for MongoDB and MySQL
- Page Object Model and a Page Factory example
- Example UI and API tests (TypeScript)

Quick start

1. Install dependencies

```bash
npm install
```

2. Install Playwright browsers

```bash
npm run prepare
```

3. Run tests

```bash
npm test
# or run UI/API separately:
npm run test:ui
npm run test:api
```

Notes

- Add a `.env` file (or environment variables) for BASE_URL, API_BASE, and DB connection strings.
- The example pages and selectors are placeholders. Replace them with selectors for your application.
- After installing, `npm run build` will compile TypeScript to `dist/`.

Next steps

- Add linting (ESLint), formatter (Prettier), and CI pipeline
- Add credential vault integration and secrets management
- Add more utility wrappers and typed HTTP clients
