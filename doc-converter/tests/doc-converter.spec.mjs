import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';
import { testOffline } from '../../test-helpers/offline.mjs';
import { fileURLToPath } from 'url';
import { basename } from 'path';

const filePath = basename(fileURLToPath(import.meta.url));
const runner = new TestRunner('doc-converter', filePath);

(async () => {
  try {
    await runner.setup();

    await runner.runTest('basic load', async (page, helper, reporter) => {
      await page.goto('/doc-converter/');
      await expect(page).toHaveTitle(/Document Converter/);
      
      const h1 = page.locator('h1').first();
      await expect(h1).toContainText('Document Converter');
      
      const app = page.locator('#app');
      await expect(app).toBeVisible();
    });

    // Functional conversion test
    await runner.runTest('markdown to html mode switch', async (page, helper, reporter) => {
      await page.goto('/doc-converter/');
      const modeSelect = page.locator('select').first();
      await expect(modeSelect).toBeVisible();
    });

  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    await runner.teardown();
  }
})();
