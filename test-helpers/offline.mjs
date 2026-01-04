import { expect } from '@playwright/test';

/**
 * Tests if the app works offline.
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {import('./test-framework.mjs').TestReporter} [reporter]
 * @param {Function} [runFunctionalTest] - Optional callback to run functional tests in offline mode
 */
export async function testOffline(page, url, reporter, runFunctionalTest) {
    const log = (msg) => reporter ? reporter.step(msg) : console.log(msg);
    const error = (msg) => reporter ? reporter.error(msg) : console.error(msg);
    const success = (msg) => reporter ? reporter.success(msg) : console.log('✓ ' + msg);

    // Enable console logging for debugging
    page.on('console', msg => {
        if (msg.type() === 'error') {
            error(`BROWSER ERROR: ${msg.text()}`);
        }
    });

    log(`Navigating to ${url}`);
    // Navigate to the URL
    await page.goto(url);

    log('Waiting for Service Worker');
    // Wait for Service Worker to be ready
    try {
        await page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) {
                throw new Error('Service Worker not supported');
            }
            
            // Check if already active
            if (navigator.serviceWorker.controller) {
                return;
            }

            // Wait for registration
            const registration = await navigator.serviceWorker.ready;

            // Wait for activation if needed
            if (registration.active.state !== 'activated') {
                await new Promise(resolve => {
                    if (registration.active.state === 'activated') {
                        resolve();
                    } else {
                        registration.active.addEventListener('statechange', () => {
                            if (registration.active.state === 'activated') {
                                resolve();
                            }
                        });
                    }
                });
            }
        });
        success('Service Worker ready');
    } catch (e) {
        error('Service Worker failed to initialize: ' + e.message);
        throw e;
    }

    // Give it a moment to cache assets
    await page.waitForTimeout(2000);

    log('Setting offline mode');
    // Set offline mode
    await page.context().setOffline(true);

    log('Reloading page offline');
    // Reload the page to test if it loads from SW
    try {
        await page.reload({ waitUntil: 'domcontentloaded' });
    } catch (e) {
        error('Reload failed: ' + e.message);
    }

    // Assert that the offline indicator is visible and shows "Offline"
    const statusText = page.locator('#status-text');
    await expect(statusText).toBeVisible();
    await expect(statusText).toHaveText('Offline');
    success('Offline indicator visible');

    // Assert that the app content is visible
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
    success('App content visible offline');

    if (runFunctionalTest) {
        log('Running functional test in offline mode');
        await runFunctionalTest(page);
        success('Functional test passed in offline mode');
    }
    
    // Reset offline mode
    await page.context().setOffline(false);
}
