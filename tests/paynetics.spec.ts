import { test, expect, Page, Locator } from "@playwright/test";
import { acceptCookiebot } from "../utils/cookiebot.util.ts";

test.describe("Paynetics UI and API validations", () => {
  test("UI: Navigate Use Cases → Fintechs and URL validation", async ({
    page,
  }) => {
    await page.goto("/");
    await acceptCookiebot(page);

    const menu = page.locator("header ul.dsm-root-menu");

    await menu
      .locator("span.dsm-menu-text", { hasText: "Use Cases" })
      .first()
      .click();

    await menu
      .locator("ul.dsm-submenu-container li a", { hasText: "Fintechs" })
      .first()
      .click();

    await expect(page).toHaveURL(/\/fintechs\/?/i);
    console.log("✅ Valid URL https://www.paynetics.digital/fintechs/");
  });

  test("API Cookiebot validation", async ({ request }) => {
    const url =
      "https://consentcdn.cookiebot.com/consentconfig/995405ff-0a0b-47ee-a0d7-3b2f39a208c7/settings.json";

    const resp = await request.get(url);

    expect(resp.ok(), "Response should be OK").toBeTruthy();
    expect(resp.status(), "HTTP status").toBe(200);

    const data = await resp.json();

    expect(data.widget).toBeDefined();

    expect(data.widget).toHaveProperty("enabled");
    expect(data.widget).toHaveProperty("position");
    expect(data.widget).toHaveProperty("theme");
    expect(data.widget).toHaveProperty("content");

    expect(typeof data.widget.enabled).toBe("boolean");
    expect(typeof data.widget.position).toBe("object");
    expect(typeof data.widget.theme).toBe("object");
    expect(typeof data.widget.content).toBe("object");

    console.log("✅ Cookiebot JSON fields validation passed.");
  });
});
