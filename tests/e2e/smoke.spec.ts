import { expect, test } from "@playwright/test";

test("sprite atlases keep their outer matte transparent", async ({ page }) => {
  await page.goto("/");

  const alphaByAtlas = await page.evaluate(async () => {
    const atlasPaths = ["art/characters.png", "art/enemies.png", "art/weapons.png", "art/summons.png", "art/glyphs.png"];

    return Promise.all(atlasPaths.map(async (path) => {
      const response = await fetch(new URL(path, window.location.href));
      const bitmap = await createImageBitmap(await response.blob());
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error(`Unable to inspect ${path}`);
      context.drawImage(bitmap, 0, 0);
      return { path, alpha: context.getImageData(0, 0, 1, 1).data[3] };
    }));
  });

  expect(alphaByAtlas).toEqual([
    { path: "art/characters.png", alpha: 0 },
    { path: "art/enemies.png", alpha: 0 },
    { path: "art/weapons.png", alpha: 0 },
    { path: "art/summons.png", alpha: 0 },
    { path: "art/glyphs.png", alpha: 0 }
  ]);
});

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
  await expect(page.getByLabel(/Health \d+ of \d+/)).toBeVisible();
  await expect(page.getByText("SURVIVE UNTIL DAWN")).toBeVisible();
  await expect(page.getByText(/OPENING DUSK/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Active/i })).toBeVisible();
  await page.keyboard.press("KeyE");
  await expect(page.getByText(/Charging|Tap \/ E/)).toBeVisible();

  expect(consoleErrors).toEqual([]);
});
