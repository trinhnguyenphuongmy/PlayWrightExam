# Playwright Automation Testing Framework

## 1. Introduction

This project is an automation testing framework built with Playwright for end-to-end testing of web applications.
It follows the Page Object Model (POM) design pattern to ensure better code maintenance, scalability, and readability.

## 2. Setup Guideline
Install Playwright

Open your terminal in the project root directory and run:
> npx playwright install

This command installs Playwright browsers and necessary dependencies.

## 3. Run Tests Guideline
### To Run Tests

Open the project folder in VS Code (or your preferred IDE).

Navigate to the test file, for example:
/tests/web/{test_name}.spec.ts

Right-click on the file and select:
Run Tests
or Debug Tests

### Run Multiple Tests in Parallel

Playwright supports parallel execution by default, allowing multiple test files or test cases to run simultaneously.

Default Parallel Execution

When you run:
> npx playwright test
Playwright will automatically run multiple tests in parallel based on your system’s CPU cores.

### Customizing Parallelism

You can configure the number of workers (parallel threads) in your playwright.config.ts file, for example:

In playwright.config.ts:
workers: 4

Or override it directly from the command line:
> npx playwright test --workers=4

### Run a test folder

To run all tests in the /tests/web folder in parallel:
> npx playwright test tests/web

## 4. Framework Structure

├── playwright.config.ts          # Global Playwright configuration

├── src/tests/web          # Test case spec TypeScript files

├── src/pages/web          # Page Object Model (POM) files for web pages

├── src/helpers          # Custom helper functions and libraries

├── src/data          # Test data files and data objects

├── src/utils          # Utility functions and reusable modules

## 5. Contribution

We welcome contributions!
Fork the repository
Create a new branch for your feature or bug fix
Submit a pull request with a clear description of your changes
Please ensure that your code follows the existing structure and includes proper documentation.

## 6. Copyright

© 2025 AGEST Company. All rights reserved.

## 7. Contact

For questions, feedback, or support, please reach out: my.trinh@agest.vn
