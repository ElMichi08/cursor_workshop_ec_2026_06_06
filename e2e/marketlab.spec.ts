import { expect, test } from "@playwright/test";

test("renders the MarketLab starter", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "MarketLab is ready." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /marketlab/i })).toBeVisible();
  await expect(page.getByText(/cursor workshop \/ quito/i)).toBeVisible();
  await expect(page.getByText(/local setup is running/i)).toBeVisible();
});
