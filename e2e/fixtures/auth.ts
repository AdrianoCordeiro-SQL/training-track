import { expect, type Page, type TestInfo } from "@playwright/test";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function skipIfAuthEnvMissing(testInfo: TestInfo): void {
  const hasAuthEnv =
    !!process.env.E2E_USER_EMAIL && !!process.env.E2E_USER_PASSWORD;
  testInfo.skip(
    !hasAuthEnv,
    "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run authenticated E2E tests.",
  );
}

export async function loginWithTestUser(page: Page): Promise<void> {
  const email = getRequiredEnv("E2E_USER_EMAIL");
  const password = getRequiredEnv("E2E_USER_PASSWORD");

  await page.goto("/login");
  await page.getByPlaceholder("seu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("/");
}
