import { test, expect } from '@playwright/test';

//Change url to deploed location to run tests on deployed version
const BASE_URL = 'http://localhost:5173';

// Testing in case pages are broken
test('homepage loads', async ({ page }) => {
    await page.goto(`${BASE_URL}`);
    await expect(page.locator('h1')).toHaveText('MacroHub');
});

test('aboutpage loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await expect(page.locator('h3')).toHaveText('ABOUT');
});

test('marketplace loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/marketplace`);
    await expect(page.locator('h3')).toHaveText('Marketplace');
});

test('loginpage loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('h1')).toHaveText('Login');
});

test('registerpage loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.locator('h1')).toHaveText('Register');
});

//requires backend server to run with one entry for a macro in the database
test('macropage loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/macro/1`);
    await expect(page.locator('h4')).toBeVisible();
});
// Authentication testing
test('require correct credentials before login', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Fill all fields');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/login`);
    const usernameInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // Ensure input fields are empty
    await usernameInput.fill('');
    await passwordInput.fill('erere');

    // Trigger the form submission by explicitly clicking the login button
    // Ensure the button is enabled and visible before clicking
    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
});
