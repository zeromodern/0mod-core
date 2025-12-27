import { TestRunner, assert } from '../../test-helpers/test-framework.mjs';

const runner = new TestRunner('image-converter');

async function run() {
  let success = true;
  try {
    await runner.setup();

    success &= await runner.runTest('basic load', async (page, helper) => {
      await page.goto('/image-converter/');
      const title = await page.title();
      assert.matches(title, /Image Converter/);

      const h1 = await page.locator('h1').first().textContent();
      assert.includes(h1, 'Image Converter');

      const appVisible = await page.locator('#app').isVisible();
      assert.ok(appVisible, '#app should be visible');
    });

    success &= await runner.runTest('share and bookmark buttons present', async (page, helper) => {
      await page.goto('/image-converter/');

      // Check buttons in the app's footer (within #app)
      const appShareButton = await page.locator('#app button:has-text("Share Tool")');
      assert.ok(await appShareButton.isVisible(), 'Share Tool button in app should be visible');

      const appBookmarkButton = await page.locator('#app button:has-text("Bookmark Tool")');
      assert.ok(await appBookmarkButton.isVisible(), 'Bookmark Tool button in app should be visible');
    });

    success &= await runner.runTest('conversion flow', async (page, helper) => {
      await page.goto('/image-converter/');

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
      await filenameInput.waitFor({ state: 'visible', timeout: 10000 });
      const filenameValue = await filenameInput.inputValue();
      assert.strictEqual(filenameValue, 'test');

      // Check extension
      const extensionSpan = page.locator('#download-filename + span');
      const extensionText = await extensionSpan.textContent();
      assert.strictEqual(extensionText.trim(), '.jpeg');

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