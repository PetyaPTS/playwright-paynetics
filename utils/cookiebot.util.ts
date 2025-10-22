import { Page, expect } from "@playwright/test";

export async function acceptCookiebot(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");

  //locate in DOM
  const dialog = page.locator("#CybotCookiebotDialog");
  const dialogIsVisible = await dialog.isVisible().catch(() => false);

  if (dialogIsVisible) {
    const okMain = dialog.getByRole("button", { name: /^ok$/i }).first();
    const allowAllMain = dialog.locator(
      "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
    );
    const closeMain = dialog.locator("#CybotCookiebotBannerCloseButtonE2E");

    const candidateMain = await pickVisible([okMain, allowAllMain, closeMain]);
    if (candidateMain) {
      await candidateMain.scrollIntoViewIfNeeded().catch(() => {});
      await candidateMain.click({ timeout: 5000 });
      await expect(dialog)
        .toBeHidden({ timeout: 5000 })
        .catch(() => {});
      return;
    }
  }

  //Iframe and buttons inside
  const iframeSel = 'iframe[src*="consentcdn.cookiebot.com"]';
  const iframeEl = page.locator(iframeSel);

  if ((await iframeEl.count()) > 0) {
    const f = page.frameLocator(iframeSel);

    const okIframe = f.getByRole("button", { name: /^ok$/i }).first();
    const allowAllIframe = f.locator(
      "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"
    );
    const closeIframe = f.locator("#CybotCookiebotBannerCloseButtonE2E");

    const candidateIframe = await pickVisible([
      okIframe,
      allowAllIframe,
      closeIframe,
    ]);

    if (candidateIframe) {
      await candidateIframe.scrollIntoViewIfNeeded().catch(() => {});
      await candidateIframe.click({ timeout: 5000 });
      await iframeEl
        .waitFor({ state: "detached", timeout: 5000 })
        .catch(() => {});
      return;
    }
  }

  await page.evaluate(() => {
    document.getElementById("CybotCookiebotDialog")?.remove();
    //if the Iframe is visible remove it
    const ifr = Array.from(document.querySelectorAll("iframe")).find(
      (el) =>
        el instanceof HTMLIFrameElement &&
        el.src.includes("consentcdn.cookiebot.com") &&
        (el.offsetWidth > 0 || el.offsetHeight > 0)
    );
    if (ifr) ifr.remove();
  });
  await page.waitForTimeout(100);
}

async function pickVisible(
  candidates: import("@playwright/test").Locator[]
): Promise<import("@playwright/test").Locator | null> {
  for (const loc of candidates) {
    if (await loc.isVisible().catch(() => false)) return loc;
  }
  return null;
}
