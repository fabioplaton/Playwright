import { test, expect } from '@playwright/test';

test.describe('funcionalidade login', () =>{

  test.beforeEach('Visitar o site', async ({page}) => { 
    await page.goto('https://www.saucedemo.com/v1/index.html');
  })
  
  test('teste login válido', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.locator('.peek')).toBeVisible();
    await expect(page.locator('#inventory_filter_container')).toContainText('Products');
  });

  test('test login usuário inválido', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('andrecoelho');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('test passwor errado', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('swaglabs');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('test usuário em branco', async ({ page }) => {
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username is required');
  });

  test('test senha em branco', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Password is required');
  });

})

test.describe('funcionalidade de add, remover e checkout do carrinho', () =>{

  test.beforeEach('realizando o login', async ({page}) =>{
    await page.goto('https://www.saucedemo.com/v1/index.html');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.getByRole('button', { name: 'LOGIN' }).click();
  })

  test('test adicionando ao carrinho', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$29\.99ADD TO CART$/ }).getByRole('button').click();
    await page.locator('div').filter({ hasText: /^\$9\.99ADD TO CART$/ }).getByRole('button').click();
    await expect(page.getByRole('link', { name: '2' })).toBeVisible();
    await expect(page.locator('#shopping_cart_container')).toContainText('2');
    await page.getByRole('link', { name: '2' }).click();
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('#contents_wrapper')).toContainText('Your Cart');
  });

  test('test removendo item do carrinho', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$29\.99ADD TO CART$/ }).getByRole('button').click();
    await page.locator('div').filter({ hasText: /^\$9\.99ADD TO CART$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    await page.getByRole('link', { name: '3' }).click();
    await expect(page.locator('#shopping_cart_container')).toContainText('3');
    await page.locator('div').filter({ hasText: /^29\.99REMOVE$/ }).getByRole('button').click();
    await expect(page.locator('#shopping_cart_container')).toContainText('2');
  });

  test('test finalizando compra', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^\$29\.99ADD TO CART$/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'ADD TO CART' }).nth(1).click();
    await page.getByRole('link', { name: '2' }).click();
    await page.getByRole('link', { name: 'CHECKOUT' }).click();
    await expect(page.locator('#contents_wrapper')).toContainText('Checkout: Your Information');
    await page.locator('[data-test="firstName"]').fill('carol');
    await page.locator('[data-test="lastName"]').fill('magalhães');
    await page.locator('[data-test="postalCode"]').fill('4444444');
    await page.getByRole('button', { name: 'CONTINUE' }).click();
    await expect(page.locator('#contents_wrapper')).toContainText('Checkout: Overview');
    await page.getByRole('link', { name: 'FINISH' }).click();
    await expect(page.locator('#checkout_complete_container').getByRole('img')).toBeVisible();
  });
  
})
