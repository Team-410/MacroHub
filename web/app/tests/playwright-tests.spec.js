import { test, expect } from '@playwright/test';

test('page loads', async ({ page }) => {
    await page.goto('localhost:5173');
    await expect(page).toHaveTitle('MacroHub');
});
