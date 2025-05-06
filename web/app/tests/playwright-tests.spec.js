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
test('check empty fields before login', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Fill all fields');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await emailInput.fill('');
    await passwordInput.fill('');

    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
});

test('check empty fields before register', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Fill all fields');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/register`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const usernameInput = page.locator('input[name="fullname"]')
    const registerButton = page.locator('button[type="submit"]');

    await emailInput.fill('');
    await passwordInput.fill('');
    await usernameInput.fill('')

    await expect(registerButton).toBeEnabled();
    await expect(registerButton).toBeVisible();
    await registerButton.click();
});

test('email must contain @ before register', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Email must contain @');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/register`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const usernameInput = page.locator('input[name="fullname"]')
    const registerButton = page.locator('button[type="submit"]');

    await emailInput.fill('email');
    await passwordInput.fill('passwd');
    await usernameInput.fill('user')

    await expect(registerButton).toBeEnabled();
    await expect(registerButton).toBeVisible();
    await registerButton.click();
});

//rest of authentication testing is dependent of credentials set with this test
test('register account with correct credentials', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('User registered succesfully');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/register`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const usernameInput = page.locator('input[name="fullname"]')
    const registerButton = page.locator('button[type="submit"]');

    //make sure these credentials are not in the database already
    await emailInput.fill('user@exampleemail.somethings');
    await passwordInput.fill('passwd123');
    await usernameInput.fill('makesurethisnameusernameisnotalreadyinthedbs');

    await expect(registerButton).toBeEnabled();
    await expect(registerButton).toBeVisible();
    await registerButton.click();
});

//this test is dependent on creadentials provided provided in test "register account with correct credentials"
test('login with registered credentials', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Login succesful!');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await emailInput.fill('user@exampleemail.something');
    await passwordInput.fill('passwd123');

    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
});

test('prevent login with wrong passwd', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Virhe kirjautumisessa: Check email or password');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await emailInput.fill('user@exampleemail.something');
    await passwordInput.fill('passwd123wrong');

    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
});

test('prevent login with wrong email', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Virhe kirjautumisessa: Check email or password');
        await dialog.dismiss();
    });

    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await emailInput.fill('user@exampleemail.something.wrong');
    await passwordInput.fill('passwd123');

    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await loginButton.click();
});

test('login and logout', async ({ page }) => {
    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe("alert");
        expect(dialog.message()).toBe('Login succesful!');
        await dialog.accept();
    });

    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await emailInput.fill('user@exampleemail.somethings');
    await passwordInput.fill('passwd123');

    await expect(loginButton).toBeEnabled();
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    await page.waitForURL(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const logoutButton = page.getByRole('button', { name: /logout/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    await page.waitForURL(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const registerButton = page.getByRole('link', { name: /Register/i });
    await expect(registerButton).toBeVisible();
});
