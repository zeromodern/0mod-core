import { TestRunner, assert } from '../../test-helpers/test-framework.mjs';
import { Buffer } from 'buffer';

const runner = new TestRunner('pdf-merge');

async function run() {
  let success = true;
  try {
    await runner.setup();

    success &= await runner.runTest('basic load', async (page, helper) => {
      await page.goto('/pdf-merge/');
      const title = await page.title();
      assert.matches(title, /PDF Merge/);
      
      const h1 = await page.locator('h1').first().textContent();
      assert.includes(h1, 'PDF Merge');
      
      const appVisible = await page.locator('#app').isVisible();
      assert.ok(appVisible, '#app should be visible');
    });

    success &= await runner.runTest('core flow', async (page, helper) => {
      await page.goto('/pdf-merge/');
      
      // Create dummy PDF buffers for testing
      const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 0 >>\nstream\nendstream\nendobj\ntrailer\n<< /Root 1 0 R /Size 5 >>\n%%EOF');

      // Upload two files
      await page.setInputFiles('#pdf-select', [
        { name: 'test1.pdf', mimeType: 'application/pdf', buffer: pdfBuffer },
        { name: 'test2.pdf', mimeType: 'application/pdf', buffer: pdfBuffer }
      ]);

      // Verify files are listed
      const fileListText = await page.locator('#file-list').textContent();
      assert.includes(fileListText, 'test1.pdf');
      assert.includes(fileListText, 'test2.pdf');

      // Click merge button
      const mergeBtn = page.getByRole('button', { name: 'Merge PDFs' });
      const isEnabled = await mergeBtn.isEnabled();
      assert.ok(isEnabled, 'Merge button should be enabled');
      await mergeBtn.click();

      // Verify download section appears
      const filenameInput = page.locator('#download-filename');
      await filenameInput.waitFor({ state: 'visible', timeout: 10000 });
      const filenameValue = await filenameInput.inputValue();
      assert.strictEqual(filenameValue, 'test1-merged');

      // Click download button
      const downloadBtn = page.getByRole('button', { name: 'Download' });
      await downloadBtn.click();
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
