import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';
import { Buffer } from 'buffer';

const runner = new TestRunner('image-converter');

(async () => {
  try {
    await runner.setup();

    await runner.runTest('basic load', async (page, helper, reporter) => {
      await page.goto('/image-converter/');
      await expect(page).toHaveTitle(/Image Converter/);

      const h1 = page.locator('h1').first();
      await expect(h1).toContainText('Image Converter');

      const app = page.locator('#app');
      await expect(app).toBeVisible();
    });

    await runner.runTest('bulk conversion and zip', async (page, helper, reporter) => {
      await page.goto('/image-converter/');
      const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

      await page.setInputFiles('#file-upload', [
        { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer },
        { name: 'test2.png', mimeType: 'image/png', buffer: imageBuffer }
      ]);

      await page.selectOption('#output-format', 'image/jpeg');
      await page.getByRole('button', { name: 'Convert All' }).click();

      const downloadZipBtn = page.getByRole('button', { name: 'Download All (ZIP)' });
      await expect(downloadZipBtn).toBeVisible({ timeout: 10000 });
    });

    await runner.runTest('image to pdf with page size', async (page, helper, reporter) => {
      await page.goto('/image-converter/');
      const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

      await page.setInputFiles('#file-upload', [
        { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
      ]);

      await page.selectOption('#output-format', 'application/pdf');
      
      const pageSizeSelect = page.locator('#pdf-page-size');
      await expect(pageSizeSelect).toBeVisible();
      await pageSizeSelect.selectOption('a4');

      await page.getByRole('button', { name: 'Convert All' }).click();
      const downloadBtn = page.getByRole('button', { name: 'Download File' });
      await expect(downloadBtn).toBeVisible({ timeout: 10000 });
    });

    await runner.runTest('remove exif checkbox', async (page, helper, reporter) => {
      await page.goto('/image-converter/');
      const checkbox = page.locator('#remove-exif');
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    });

  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    await runner.teardown();
  }
})();
