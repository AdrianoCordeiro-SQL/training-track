import { test, expect } from "@playwright/test";
import { loginWithTestUser, skipIfAuthEnvMissing } from "../fixtures/auth";

test("creates a workout and shows it on dashboard", async ({ page }, testInfo) => {
  skipIfAuthEnvMissing(testInfo);

  const workoutTitle = `E2E Treino ${Date.now()}`;

  await loginWithTestUser(page);
  await page.goto("/create-workout");

  await page.getByLabel("Título").fill(workoutTitle);
  await page.getByLabel("Nome").fill("Agachamento Livre");
  await page.getByLabel("Descanso (segundos)").fill("90");

  // First pair belongs to "Série 1 (Referência)" for the first exercise.
  const numericInputs = page.locator('input[type="number"]');
  await numericInputs.nth(1).fill("10");
  await numericInputs.nth(2).fill("80");

  await page.getByRole("button", { name: "Salvar Treino" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(workoutTitle)).toBeVisible();
});
