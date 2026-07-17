import { test, expect } from "@playwright/test";

const EMAIL = process.env.QA_EMAIL || "admin@essethr.local";
const PASSWORD = process.env.QA_PASSWORD || "DevAdmin123!";

const APP_ROUTES = [
  { path: "/app/dashboard", label: "Dashboard" },
  { path: "/app/employees", label: "Employees" },
  { path: "/app/attendance", label: "Attendance" },
  { path: "/app/leaves", label: "Leaves" },
  { path: "/app/payroll/list", label: "Payroll" },
  { path: "/app/reports", label: "Reports" },
  { path: "/app/inbox", label: "Approvals" },
  { path: "/app/settings", label: "Settings" },
  { path: "/app/org", label: "Organization" },
  { path: "/app/users", label: "Users" },
  { path: "/app/shifts", label: "Shifts" },
  { path: "/app/recruitment", label: "Recruitment" },
  { path: "/app/onboarding", label: "Onboarding" },
  { path: "/app/performance", label: "Performance" },
  { path: "/app/training", label: "Training" },
  { path: "/app/analytics", label: "Analytics" },
  { path: "/app/announcements", label: "Announcements" },
  { path: "/app/portal", label: "Employee portal" },
];

test.describe("EssetHR authenticated features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("admin can login and reach core modules", async ({ page }) => {
    test.skip(!process.env.QA_E2E_FULL, "Set QA_E2E_FULL=1 with backend running via npm run dev");

    await page.goto("/login");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });

    for (const { path, label } of APP_ROUTES) {
      await page.goto(path);
      await expect(page).not.toHaveURL(/login/);
      await expect(page.locator("body")).not.toContainText("Cannot GET");
      await expect(page.locator("body")).not.toContainText("Html Webpack Plugin");
    }
  });
});

test.describe("EssetHR public auth pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel("First name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
  });

  test("org signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /sign up/i })).toBeVisible();
    await expect(page.getByLabel("Organization Name")).toBeVisible();
  });

  test("unauthenticated user redirected from dashboard", async ({ page }) => {
    await page.goto("/app/dashboard");
    await expect(page).toHaveURL(/login/);
  });
});
