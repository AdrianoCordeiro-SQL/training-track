import { test, expect } from "@playwright/test";
import { loginWithTestUser, skipIfAuthEnvMissing } from "../fixtures/auth";

test("creates a workout and shows it on dashboard", async ({ page }, testInfo) => {
  skipIfAuthEnvMissing(testInfo);

  const workoutTitle = `E2E: Treino ${Date.now()}`;

  await loginWithTestUser(page);
  await page.goto("/create-workout");

  await page.getByLabel("Título").fill(workoutTitle);
  await page.getByLabel("Nome").first().fill("Agachamento Livre");
  await page.getByLabel("Descanso (segundos)").first().fill("90");

  await page.getByLabel("Reps").first().fill("10");
  await page.getByLabel("Kg").first().fill("80");

  await page.getByRole("button", { name: "Salvar Treino" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(workoutTitle)).toBeVisible();
});
