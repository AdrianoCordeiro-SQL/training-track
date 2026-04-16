import { test, expect } from "@playwright/test";
import { loginWithTestUser, skipIfAuthEnvMissing } from "../fixtures/auth";

test("shows required field messages for empty login submission", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("O e-mail é obrigatório")).toBeVisible();
  await expect(page.getByText("A senha é obrigatória")).toBeVisible();
});

test("logs in with test credentials", async ({ page }, testInfo) => {
  skipIfAuthEnvMissing(testInfo);
  await loginWithTestUser(page);
  await expect(page.getByRole("heading", { name: "Visão Geral" })).toBeVisible();
});
