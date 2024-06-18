import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.magazinevoce.com.br/magazinedasgeladeiras/');
  await page.getByText('CONCORDAR E FECHAR').click();
  await page.getByTestId('input-search').click();
  await page.getByTestId('input-search').fill('iphone');
  await page.getByText('iphone 15', { exact: true }).click();
  await page.getByRole('link', { name: 'magalu indica Apple iPhone 15 128GB Preto 6,1" 48MP iOS 5G Apple iPhone 15' }).click();
  await page.getByRole('button', { name: 'Adicionar à Sacola', exact: true }).click();
  await page.getByTestId('financial-services-submit').click();
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('button', { name: 'Excluir' }).click();
});