# Playwright Test Automation Framework

This project implements a robust and maintainable Playwright-based test automation framework for web applications. It adheres to SOLID principles and utilizes advanced design patterns like Factory and Singleton for efficient browser and session management.

## Key Features

   Browser Factory: Centralized logic for creating browser instances (`Chromium`, `Firefox`, `WebKit`).
   Session Singleton: Ensures a single point of control for browser sessions, optimizing resource usage.
   Optimized Execution: Reuses the same browser instance across tests within a worker to significantly reduce execution time.
   Dynamic Environment Selection: Easily switch between environments (`stage`, `pp`, `prod`) via CLI.
   Automatic Retries: Configured to retry failed tests up to 3 times.
   Page Object Model (POM): Encapsulates page-specific logic for better maintainability.

## Project Structure

   `tests/`
       `ui/`
           `page-classes/`: POM classes (e.g., `login.page.ts`).
           `test-cases/`: Test specifications.
               `baseFixture.ts`: Custom fixture using `SessionManager` for setup/teardown.
               `loginTest/`: Example login tests.
   `utils/`
       `BrowserFactory.ts`: Factory class for creating browsers.
       `SessionManager.ts`: Singleton class for managing browser/context lifecycle.
       `csv-utils.ts`: CSV handling utilities.
   `envs/`: Environment configurations (`stage.ts`, `pp.ts`, `prod.ts`).
   `test-data/`: Data files (e.g., `login-credentials.csv`).
   `playwright.config.ts`: Main configuration file.

## Getting Started

### Prerequisites

   Node.js (LTS)
   npm

### Installation

```bash
npm run setup
```
This command installs all dependencies and the required Playwright browsers.

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   # On Windows Command Prompt: copy .env.example .env
   # On Windows PowerShell: Copy-Item .env.example .env
   ```
2. Edit `.env` to set your desired `TEST_ENV` (stage, pp, prod).

### Cross-Platform Notes (Windows/Mac/Linux)
- Ensure you have Node.js installed.
- If you downloaded this as a ZIP file, extract it and run `npm run setup` in the extracted folder.
- If you encounter path issues on Windows, try using PowerShell or Git Bash.

### Running Tests

Default (Stage Environment):
```bash
npx playwright test
```

Specific Environment:
Use the `TEST_ENV` variable to select `stage`, `pp`, or `prod`.
```bash
TEST_ENV=pp npx playwright test
TEST_ENV=prod npx playwright test
```

Headed Mode:
```bash
npx playwright test --headed
```

## Architecture & Design Patterns

### Browser Factory
Located in `utils/BrowserFactory.ts`. It abstracts the complexity of browser creation, allowing for easy extension and configuration of different browser types.

### Session Manager (Singleton)
Located in `utils/SessionManager.ts`. It manages the lifecycle of the Browser, Context, and Page.
   Optimization: It keeps the browser instance open across multiple tests in the same worker, closing only the context/page between tests. This drastically reduces the overhead of launching a new browser for every test.
   Teardown: A worker-scoped fixture in `baseFixture.ts` ensures the browser is properly closed when all tests in the worker are complete.

## Configuration

### Environments
Environment URLs are defined in `envs/.ts`. The active environment is selected dynamically in `playwright.config.ts` based on `TEST_ENV`.

### Retries
Tests are configured to retry 3 times on failure to handle flaky tests. This is set in `playwright.config.ts`.
