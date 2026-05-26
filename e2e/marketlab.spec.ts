import { expect, test } from "@playwright/test";

test("browses the static MarketLab starter", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /browse workshop outcomes/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /marketlab/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /open market/i }).first(),
  ).toBeVisible();

  await Promise.all([
    page.waitForURL(/\/markets\/demo-1$/),
    page
      .getByRole("link", { name: /open market/i })
      .first()
      .click(),
  ]);

  await expect(
    page.getByRole("heading", {
      name: "Will Quito record measurable rain this Saturday?",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Resolution criteria" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contract" })).toBeVisible();
});
