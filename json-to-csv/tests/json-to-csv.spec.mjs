import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { basename } from 'path';

const filePath = basename(fileURLToPath(import.meta.url));
const runner = new TestRunner('json-to-csv', filePath);

export const runFunctionalTest = async (page) => {
  const jsonInput = '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]';
  const expectedCsv = 'name,age\r\nJohn,30\r\nJane,25\r\n';

  await page.locator('#json-input').fill(jsonInput);
  await page.getByRole('button', { name: 'Convert to CSV' }).click();

  // Check for Table View (default)
  const table = page.locator('table');
  await expect(table).toBeVisible();
  
  // Check headers
  await expect(page.locator('th').filter({ hasText: 'name' })).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'age' })).toBeVisible();

  // Check rows
  await expect(page.locator('td').filter({ hasText: 'John' })).toBeVisible();
  await expect(page.locator('td').filter({ hasText: '30' })).toBeVisible();

  // Check Toggle
  await page.getByRole('button', { name: 'Raw CSV' }).click();
  const outputValue = await page.locator('#csv-output').inputValue();
  // Normalize line endings for comparison
  expect(outputValue.replace(/\r\n/g, '\n')).toBe(expectedCsv.replace(/\r\n/g, '\n'));

  const downloadBtn = page.getByRole('button', { name: 'Download' });
  await expect(downloadBtn).toBeVisible();
};

(async () => {
  if (process.argv[1] === import.meta.filename) {
    try {
      await runner.setup();

      await runner.runTest('basic load', async (page, helper, reporter) => {
      await page.goto('/json-to-csv/');
      await expect(page).toHaveTitle(/JSON to CSV/);
      
      const h1 = page.locator('h1').first();
      await expect(h1).toContainText('JSON to CSV');
      
      const app = page.locator('#app');
      await expect(app).toBeVisible();
    });

    await runner.runTest('core flow', async (page, helper, reporter) => {
      await page.goto('/json-to-csv/');
      await runFunctionalTest(page);
    });

    await runner.runTest('error handling', async (page, helper, reporter) => {
      await page.goto('/json-to-csv/');
      
      await page.locator('#json-input').fill('invalid json');
      await page.getByRole('button', { name: 'Convert to CSV' }).click();

      const alert = page.locator('.bg-red-50');
      await expect(alert).toBeVisible();
      
      const alertText = await alert.textContent();
      expect(alertText).toContain('Unexpected token');
    });


  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    await runner.teardown();
  }
  }
})();
