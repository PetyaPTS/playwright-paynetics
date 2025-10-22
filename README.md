# 🎭 Playwright Paynetics Tests

Automated **UI & API tests** for [Paynetics](https://www.paynetics.digital),  
built with **Playwright** and **TypeScript**.

The framework is designed for clarity and ease of maintenance, structured as follows:

tests/
 └─ paynetics.spec.ts       # UI navigation & URL validation tests
utils/
 └─ cookiebot.util.ts       # Cookiebot utility for cookie consent handling
playwright.config.ts        # Playwright configuration
package.json                # Project dependencies and scripts