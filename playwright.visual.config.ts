import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "visual.spec.ts",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: "http://127.0.0.1:5174",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5174",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 960, height: 540 } } },
    { name: "pixel-7-landscape", use: { ...devices["Pixel 7 landscape"] } }
  ]
});
