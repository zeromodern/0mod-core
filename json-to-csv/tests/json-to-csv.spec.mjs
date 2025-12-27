import { TestRunner, assert } from '../../test-helpers/test-framework.mjs';

const runner = new TestRunner('json-to-csv');

async function run() {
  let success = true;
  try {
    await runner.setup();

    success &= await runner.runTest('basic load', async (page, helper) => {
      await page.goto('/json-to-csv/');
      const title = await page.title();
      assert.matches(title, /JSON to CSV/);
      
      const h1 = await page.locator('h1').first().textContent();
      assert.includes(h1, 'JSON to CSV');
      
      const appVisible = await page.locator('#app').isVisible();
      assert.ok(appVisible, '#app should be visible');
    });

    success &= await runner.runTest('core flow', async (page, helper) => {
      await page.goto('/json-to-csv/');
      
      const jsonInput = '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]';
      const expectedCsv = 'name,age\nJohn,30\nJane,25\n';

      await page.locator('#json-input').fill(jsonInput);
      await page.getByRole('button', { name: 'Convert to CSV' }).click();

      const outputValue = await page.locator('#csv-output').inputValue();
      assert.strictEqual(outputValue, expectedCsv);

      const downloadBtnVisible = await page.getByRole('button', { name: 'Download' }).isVisible();
      assert.ok(downloadBtnVisible, 'Download button should be visible');
    });

    success &= await runner.runTest('error handling', async (page, helper) => {
      await page.goto('/json-to-csv/');
      
      await page.locator('#json-input').fill('invalid json');
      await page.getByRole('button', { name: 'Convert to CSV' }).click();

      const alertVisible = await page.locator('.bg-red-50').isVisible();
      assert.ok(alertVisible, 'Error alert should be visible');
      
      const alertText = await page.locator('.bg-red-50').textContent();
      assert.includes(alertText, 'Unexpected token');
    });

  } catch (error) {
    console.error('Test suite failed:', error);
    success = false;
  } finally {
    await runner.teardown(success);
    process.exit(success ? 0 : 1);
  }
}

run();
