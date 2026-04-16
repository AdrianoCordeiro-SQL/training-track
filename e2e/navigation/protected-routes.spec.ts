import { test, expect } from "@playwright/test";

test("redirects unauthenticated user from dashboard to login", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});
