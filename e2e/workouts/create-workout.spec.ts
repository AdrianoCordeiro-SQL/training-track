import { test, expect } from "@playwright/test";
import { loginWithTestUser, skipIfAuthEnvMissing } from "../fixtures/auth";

test("creates a workout and shows it on dashboard", async ({ page }, testInfo) => {
  skipIfAuthEnvMissing(testInfo);

  const workoutTitle = `E2E Treino ${Date.now()}`;

  await loginWithTestUser(page);
  await page.goto("/create-workout");

  await page.getByLabel("Título").fill(workoutTitle);
  await page.getByPlaceholder("Ex: Agachamento Livre").fill("Agachamento Livre");

  // Order: restTime, reps, weight for the first exercise card.
  const numericInputs = page.locator('input[type="number"]');
  await numericInputs.nth(0).fill("90");
  await numericInputs.nth(1).fill("10");
  await numericInputs.nth(2).fill("80");

  await page.getByRole("button", { name: "Salvar Treino" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(workoutTitle)).toBeVisible();
});
