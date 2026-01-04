import { TestRunner } from '../../test-helpers/test-framework.mjs';
import { expect } from '@playwright/test';
import { Buffer } from 'buffer';
import { testOffline } from '../../test-helpers/offline.mjs';

const runner = new TestRunner('pdf-merge');

const runFunctionalTest = async (page) => {
  // Create dummy PDF buffers for testing
  const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 0 >>\nstream\nendstream\nendobj\ntrailer\n<< /Root 1 0 R /Size 5 >>\n%%EOF');

  // Upload two files
  await page.setInputFiles('#pdf-select', [
    { name: 'test1.pdf', mimeType: 'application/pdf', buffer: pdfBuffer },
    { name: 'test2.pdf', mimeType: 'application/pdf', buffer: pdfBuffer }
  ]);

  // Verify files are listed
  const fileList = page.locator('#file-list');
  await expect(fileList).toContainText('test1.pdf');
  await expect(fileList).toContainText('test2.pdf');

  // Click merge button
  const mergeBtn = page.getByRole('button', { name: 'Merge PDFs' });
  await expect(mergeBtn).toBeEnabled();
  await mergeBtn.click();

  // Verify download section appears
  const filenameInput = page.locator('#download-filename');
  await expect(filenameInput).toBeVisible({ timeout: 10000 });
  const filenameValue = await filenameInput.inputValue();
  expect(filenameValue).toBe('test1-merged');

  // Click download button
  const downloadBtn = page.getByRole('button', { name: 'Download' });
  await downloadBtn.click();
};

(async () => {
  try {
    await runner.setup();

    await runner.runTest('basic load', async (page, helper, reporter) => {
      await page.goto('/pdf-merge/');
      await expect(page).toHaveTitle(/PDF Merge/);
      
      const h1 = page.locator('h1').first();
      await expect(h1).toContainText('PDF Merge');
      
      const app = page.locator('#app');
      await expect(app).toBeVisible();
    });

    await runner.runTest('core flow', async (page, helper, reporter) => {
      await page.goto('/pdf-merge/');
      await runFunctionalTest(page);
    });

    await runner.runTest('should work offline', async (page, helper, reporter) => {
      await testOffline(page, '/pdf-merge/', reporter, runFunctionalTest);
    });

  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  } finally {
    await runner.teardown();
  }
})();
