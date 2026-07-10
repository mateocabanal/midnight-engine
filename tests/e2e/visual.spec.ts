import { expect, test, type Page } from "@playwright/test";

const waitForVisualState = async (page: Page, state: "main-menu" | "run-hud") => {
  await page.goto(`/?visual=${state}`);
  await expect(page.locator("html")).toHaveAttribute("data-visual-state", state);
  await expect(page.locator(".art-loading")).toBeHidden();
};

test("visual harness: main menu", async ({ page }) => {
  await waitForVisualState(page, "main-menu");
  await expect(await page.screenshot({ animations: "disabled" })).toMatchSnapshot("main-menu.png");
});

test("visual harness: combat HUD", async ({ page }) => {
  await waitForVisualState(page, "run-hud");
  await expect(await page.screenshot({ animations: "disabled" })).toMatchSnapshot("run-hud.png");
});
