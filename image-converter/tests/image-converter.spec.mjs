import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';
import { Buffer } from 'buffer';

const runner = new TestRunner('image-converter');

export const runFunctionalTest = async (page) => {
  // Create dummy image buffer (minimal PNG)
  const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

  // Upload file
  await page.setInputFiles('#file-upload', [
    { name: 'test.png', mimeType: 'image/png', buffer: imageBuffer }
  ]);

  // Select output format to jpeg
  await page.selectOption('#output-format', 'image/jpeg');

  // Click convert
  const convertBtn = page.getByRole('button', { name: 'Convert' });
  await convertBtn.click();

  // Wait for download section
  const filenameInput = page.locator('#download-filename');
  await expect(filenameInput).toBeVisible({ timeout: 10000 });
  const filenameValue = await filenameInput.inputValue();
  expect(filenameValue).toBe('test');

  // Check extension
  const extensionSpan = page.locator('#download-filename + span');
  await expect(extensionSpan).toContainText('.jpeg');

  // Click download button
  const downloadBtn = page.getByRole('button', { name: 'Download' });
  await downloadBtn.click();
};

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

    await runner.runTest('share and bookmark buttons present', async (page, helper, reporter) => {
      await page.goto('/image-converter/');

      // Check buttons in the app's footer (within #app)
      const shareBtn = page.locator('#app').getByRole('button', { name: 'Share Tool' });
      await expect(shareBtn).toBeVisible();

      const bookmarkBtn = page.locator('#app').getByRole('button', { name: 'Bookmark Tool' });
      await expect(bookmarkBtn).toBeVisible();
    });

    await runner.runTest('conversion flow', async (page, helper, reporter) => {
      await page.goto('/image-converter/');
      await runFunctionalTest(page);
    });

    await runner.runTest('UI state resets', async (page, helper, reporter) => {
      await page.goto('/image-converter/');
      
      // Setup image
      const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      
      // Upload and Convert
      await page.setInputFiles('#file-upload', [
        { name: 'test.png', mimeType: 'image/png', buffer: imageBuffer }
      ]);
      await page.selectOption('#output-format', 'image/jpeg');
      await page.getByRole('button', { name: 'Convert' }).click();
      
      // Verify Download visible
      await expect(page.locator('#download-filename')).toBeVisible();
      
      // Change Output Format -> Download should hide
      await page.selectOption('#output-format', 'image/png');
      await expect(page.locator('#download-filename')).toBeHidden();
      
      // Convert again to get download back
      await page.getByRole('button', { name: 'Convert' }).click();
      await expect(page.locator('#download-filename')).toBeVisible();
      
      // Upload new file -> Download should hide
      await page.setInputFiles('#file-upload', [
        { name: 'test2.png', mimeType: 'image/png', buffer: imageBuffer }
      ]);
      await expect(page.locator('#download-filename')).toBeHidden();
      // Preview should be visible
      await expect(page.locator('img[alt="Input"]')).toBeVisible();
      
      // Change Input Format -> Preview should hide (and content reset)
      await page.selectOption('#input-format', 'image/jpeg');
      await expect(page.locator('img[alt="Input"]')).toBeHidden();
      await expect(page.locator('text=No image selected')).toBeVisible();
    });


  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    await runner.teardown();
  }
})();
