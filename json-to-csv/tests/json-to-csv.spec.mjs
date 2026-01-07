import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';

const runner = new TestRunner('json-to-csv');

export const runFunctionalTest = async (page) => {
  const jsonInput = '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]';
  const expectedCsv = 'name,age\nJohn,30\nJane,25\n';

  await page.locator('#json-input').fill(jsonInput);
  await page.getByRole('button', { name: 'Convert to CSV' }).click();

  const outputValue = await page.locator('#csv-output').inputValue();
  expect(outputValue).toBe(expectedCsv);

  const downloadBtn = page.getByRole('button', { name: 'Download' });
  await expect(downloadBtn).toBeVisible();
};

(async () => {
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
})();
