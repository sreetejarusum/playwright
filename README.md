# Playwright Test Automation Framework

This project implements a Playwright-based test automation framework for web applications, focusing on robust and maintainable UI tests.

## Project Structure

The framework is organized into the following key directories:

*   `tests/`
    *   `ui/`
        *   `page-classes/`: Contains Page Object Model (POM) classes for different pages of the application. Each class represents a web page or a significant part of it, encapsulating selectors and interactions.
            *   `login.page.ts`: Page class for the login functionality.
        *   `test-cases/`: Contains the actual test specifications.
            *   `baseFixture.ts`: A custom Playwright test fixture that provides common setup (browser launch, base URL navigation) and teardown (browser close, logout) logic, as well as shared fixtures like `LoginPage` and `credentials`.
            *   `loginTest/`:
                *   `example.spec.ts`: Example test file demonstrating login functionality using the `LoginPage` class and credentials from a CSV file.
*   `test-data/`: Stores test data in various formats.
    *   `login-credentials.csv`: CSV file containing sample login credentials.
*   `utils/`: Contains utility functions used across the framework.
    *   `csv-utils.ts`: Provides functions for reading and potentially writing CSV files.
*   `envs/`: Stores environment-specific configurations.
    *   `stage.ts`: Defines the `baseURL` for the staging environment.
*   `playwright.config.ts`: Playwright configuration file.
*   `package.json`: Project dependencies and scripts.

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

### Running Tests

To run all tests in the framework, use the following command:

```bash
npx playwright test
```

To run tests in a headed browser (visible UI):

```bash
npx playwright test --headed
```

To run specific test files or folders, you can specify the path:

```bash
npx playwright test tests/ui/test-cases/loginTest/example.spec.ts
```

## Configuration

### Base URL

The base URL for the tests is configured in `envs/stage.ts` and used in `playwright.config.ts`. You can modify `envs/stage.ts` to switch between different environments or add new environment files.

### Test Data

Login credentials and other test data are stored in `test-data/login-credentials.csv`. You can extend this file or create new CSV files for different test scenarios.

### Custom Fixtures

The `tests/ui/test-cases/baseFixture.ts` file provides custom fixtures for `LoginPage` and `credentials`, which are automatically available to your tests. This promotes reusability and reduces boilerplate code.

## Page Object Model (POM)

The framework follows the Page Object Model design pattern. Each page of the application has a corresponding page class in the `tests/ui/page-classes/` directory. These classes encapsulate the locators and actions related to that page, making tests more readable and maintainable.

## Utility Functions

The `utils/` directory contains helper functions like `csv-utils.ts` for reading CSV files, which can be extended for other common tasks.
