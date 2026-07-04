import { expect, test } from "@playwright/test";

test("main menu, loadout modal, and run HUD render without console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Choose your engine." })).toBeVisible();

  await page.getByRole("button", { name: "Start Run" }).click();
  await expect(page.getByLabel("Run status")).toBeVisible();
  await expect(page.getByText("SURVIVE UNTIL DAWN")).toBeVisible();
  await expect(page.getByText(/OPENING DUSK/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Active/i })).toBeVisible();
  await page.keyboard.press("KeyE");
  await expect(page.getByText(/Charging|Tap \/ E/)).toBeVisible();

  expect(consoleErrors).toEqual([]);
});
