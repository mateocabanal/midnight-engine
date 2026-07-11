import { expect, test } from "@playwright/test";

test("one online load supports an offline reload with fonts, atlases, and menus", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Choose your engine." })).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await page.context().setOffline(true);
  await page.reload();

  await expect(page.getByRole("heading", { name: "Choose your engine." })).toBeVisible();
  await expect(page.locator(".art-loading")).toBeHidden();
});
