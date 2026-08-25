import { test, expect } from '@playwright/test';

test.describe('Login Page E2E', () => {
  test('shows error message on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    // Use #id selectors — the inputs have id="email" and id="password", not name attributes
    await page.waitForSelector('#email', { state: 'visible' });
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    // The UI shows the error text defined in the component
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('renders login form', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('#email', { state: 'visible' });
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
