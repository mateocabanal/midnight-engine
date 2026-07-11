import { expect, test, type Page } from "@playwright/test";

const waitForVisualState = async (page: Page, state: "main-menu" | "run-hud" | "skill-tree") => {
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

test("visual harness: structured skill tree", async ({ page }) => {
  await waitForVisualState(page, "skill-tree");
  await expect(page.locator(".skill-tree-nodes")).toBeVisible();
  await expect(await page.screenshot({ animations: "disabled" })).toMatchSnapshot("skill-tree.png");
});
