import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';
import { Buffer } from 'buffer';

const runner = new TestRunner('image-converter');

export async function runFunctionalTest(page) {
  const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

  await page.setInputFiles('#file-upload', [
    { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
  ]);

  await page.selectOption('#output-format', 'image/jpeg');
  await page.getByRole('button', { name: 'Convert All' }).click();
  await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 10000 });
}

(async () => {
  // Only run if this file is the main module
  if (process.argv[1] === import.meta.filename) {
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
        
        // Wait for file list to appear
        await expect(page.locator('#file-list')).toBeVisible();
        await expect(page.locator('#file-list > div')).toHaveCount(2);

        await page.getByRole('button', { name: 'Convert All' }).click();

        // Wait for conversion to finish (status done)
        await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 10000 });

        const downloadBtn = page.getByRole('button', { name: /Download/ });
        await expect(downloadBtn).toBeVisible();
      });

      await runner.runTest('image to pdf with page size', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

        await page.setInputFiles('#file-upload', [
          { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
        ]);

        await page.selectOption('#output-format', 'application/pdf');
        
        const pageSizeSelect = page.locator('#pdf-size');
        await expect(pageSizeSelect).toBeVisible();
        await pageSizeSelect.selectOption('a4');

        await page.getByRole('button', { name: 'Convert All' }).click();
        
        // Wait for conversion
        await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 10000 });

        const downloadBtn = page.getByRole('button', { name: /Download/ });
        await expect(downloadBtn).toBeVisible();
      });

      await runner.runTest('remove exif checkbox', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        // Checkbox is inside a label with text "Remove Metadata (EXIF)"
        const checkbox = page.getByLabel('Remove Metadata (EXIF)');
        await expect(checkbox).toBeVisible();
        await expect(checkbox).toBeChecked();
        await expect(checkbox).toBeEnabled();
      });

      await runner.runTest('clear all button', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

        await page.setInputFiles('#file-upload', [
          { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
        ]);

        await expect(page.locator('#file-list')).toBeVisible();
        const clearAllBtn = page.getByRole('button', { name: 'Clear All' });
        await expect(clearAllBtn).toBeVisible();
        await clearAllBtn.click();
        await expect(page.locator('#file-list')).not.toBeVisible();
      });

      await runner.runTest('changing from clears files', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

        await page.setInputFiles('#file-upload', [
          { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
        ]);

        await expect(page.locator('#file-list')).toBeVisible();
        await page.selectOption('#input-format', 'image/jpeg');
        await expect(page.locator('#file-list')).not.toBeVisible();
      });

      await runner.runTest('changing to resets conversion status', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

        await page.setInputFiles('#file-upload', [
          { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
        ]);

        await page.getByRole('button', { name: 'Convert All' }).click();
        await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 10000 });

        await page.selectOption('#output-format', 'image/webp');
        await expect(page.locator('text=Pending').first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Convert All' })).toBeVisible();
      });

      await runner.runTest('changing pdf size resets conversion status', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

        await page.setInputFiles('#file-upload', [
          { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
        ]);

        await page.selectOption('#output-format', 'application/pdf');
        await page.getByRole('button', { name: 'Convert All' }).click();
        await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 10000 });

        await page.selectOption('#pdf-size', 'a4');
        await expect(page.locator('text=Pending').first()).toBeVisible();
      });

      await runner.runTest('changing metadata resets conversion status', async (page, helper, reporter) => {
        await page.goto('/image-converter/');
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

        await page.setInputFiles('#file-upload', [
          { name: 'test1.png', mimeType: 'image/png', buffer: imageBuffer }
        ]);

        await page.getByRole('button', { name: 'Convert All' }).click();
        await expect(page.locator('text=Done').first()).toBeVisible({ timeout: 10000 });

        await page.getByLabel('Remove Metadata (EXIF)').uncheck();
        await expect(page.locator('text=Pending').first()).toBeVisible();
      });

    } catch (error) {
      console.error('Test suite failed:', error);
      process.exit(1);
    } finally {
      await runner.teardown();
    }
  }
})();
