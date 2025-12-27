/**
 * Test Framework Helper
 * 
 * Provides consistent test reporting and utilities for Playwright e2e tests
 */

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file if it exists
try {
  const envPath = resolve(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  // .env file doesn't exist or can't be read, that's okay
}

const TIMEOUT = 60000;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Console colors for better readability
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Test reporter for consistent console output
 */
export class TestReporter {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.currentTest = null;
    this.stepNumber = 0;
    this.debugMode = process.env.DEBUG === 'true';
  }

  suiteStart() {
    console.log('\n' + '='.repeat(80));
    console.log(`${colors.bright}${colors.cyan}TEST SUITE: ${this.suiteName}${colors.reset}`);
    console.log('='.repeat(80) + '\n');
  }

  suiteEnd(passed, duration) {
    console.log('\n' + '='.repeat(80));
    if (passed) {
      console.log(`${colors.bright}${colors.green}✓ TEST SUITE PASSED${colors.reset} (${duration}ms)`);
    } else {
      console.log(`${colors.bright}${colors.red}✗ TEST SUITE FAILED${colors.reset} (${duration}ms)`);
    }
    console.log('='.repeat(80) + '\n');
  }

  testStart(testName) {
    this.currentTest = testName;
    this.stepNumber = 0;
    console.log(`\n${colors.bright}${colors.blue}▶ TEST: ${testName}${colors.reset}`);
    console.log('─'.repeat(80));
  }

  testEnd(passed) {
    if (passed) {
      console.log(`${colors.green}✓ ${this.currentTest} PASSED${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${this.currentTest} FAILED${colors.reset}`);
    }
    console.log('─'.repeat(80));
  }

  step(description) {
    this.stepNumber++;
    console.log(`${colors.bright}${this.stepNumber}.${colors.reset} ${description}`);
  }

  success(message) {
    console.log(`   ${colors.green}✓${colors.reset} ${message}`);
  }

  info(message) {
    console.log(`   ${colors.cyan}ℹ${colors.reset} ${message}`);
  }

  warning(message) {
    console.log(`   ${colors.yellow}⚠${colors.reset} ${message}`);
  }

  error(message) {
    console.log(`   ${colors.red}✗${colors.reset} ${message}`);
  }

  debug(label, value) {
    if (this.debugMode) {
      console.log(`   ${colors.dim}${colors.magenta}[DEBUG]${colors.reset}${colors.dim} ${label}:${colors.reset}`);
      if (typeof value === 'string') {
        console.log(`   ${colors.dim}${value}${colors.reset}`);
      } else {
        console.log(`   ${colors.dim}${JSON.stringify(value, null, 2)}${colors.reset}`);
      }
    }
  }

  separator() {
    console.log('');
  }
}

/**
 * Server management helper
 */
export class ServerManager {
  constructor(reporter) {
    this.reporter = reporter;
    this.serverProcess = null;
  }

  async findOrStartServer() {
    let baseURL = process.env.BASE_URL;
    
    if (!baseURL) {
      this.reporter.step('Probing for running server');
      const ports = [3000, 3001, 3002];
      for (const port of ports) {
        try {
          const response = await fetch(`http://localhost:${port}`, { timeout: 5000 });
          if (response.ok) {
            baseURL = `http://localhost:${port}`;
            this.reporter.success(`Found running server on port ${port}`);
            break;
          }
        } catch (e) {
          // Continue probing
        }
      }
    } else {
      this.reporter.info(`Using BASE_URL: ${baseURL}`);
    }

    if (!baseURL && process.env.START_SERVER === 'true') {
      this.reporter.step('Starting dev server');
      this.serverProcess = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });
      
      let attempts = 0;
      while (attempts < 24) {
        try {
          const response = await fetch('http://localhost:3000', { timeout: 5000 });
          if (response.ok) {
            baseURL = 'http://localhost:3000';
            this.reporter.success('Dev server started successfully');
            break;
          }
        } catch (e) {
          // Wait and retry
        }
        await delay(5000);
        attempts++;
      }
      if (!baseURL) {
        throw new Error('Failed to start dev server');
      }
    }

    if (!baseURL) {
      throw new Error('No server available. Set BASE_URL or START_SERVER=true');
    }

    return baseURL;
  }

  cleanup() {
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
  }
}

/**
 * Browser helper with common utilities
 */
export class BrowserHelper {
  constructor(page, reporter) {
    this.page = page;
    this.reporter = reporter;
    this.consoleErrors = [];
    this.consoleWarnings = [];
    
    // Errors to ignore (external services, known issues, etc.)
    this.ignoreErrorPatterns = [
      /cloudflareinsights\.com/i,
      /cdn-cgi\/rum/i,
      /ERR_FAILED.*cloudflare/i,
      /Failed to load resource: net::ERR_FAILED/i,
    ];
    
    // Listen for console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        // Check if error should be ignored
        const shouldIgnore = this.ignoreErrorPatterns.some(pattern => pattern.test(text));
        if (!shouldIgnore) {
          this.consoleErrors.push(text);
          this.reporter.error(`Browser console error: ${text}`);
        }
      } else if (type === 'warning') {
        this.consoleWarnings.push(text);
        if (process.env.DEBUG === 'true') {
          this.reporter.warning(`Browser console warning: ${text}`);
        }
      }
    });
    
    // Listen for page errors
    page.on('pageerror', (error) => {
      const shouldIgnore = this.ignoreErrorPatterns.some(pattern => pattern.test(error.message));
      if (!shouldIgnore) {
        this.consoleErrors.push(error.message);
        this.reporter.error(`Page error: ${error.message}`);
      }
    });
  }
  
  getConsoleErrors() {
    return [...this.consoleErrors];
  }
  
  clearConsoleErrors() {
    this.consoleErrors = [];
    this.consoleWarnings = [];
  }
  
  hasConsoleErrors() {
    return this.consoleErrors.length > 0;
  }

  async waitAndClick(selector, description) {
    this.reporter.step(description || `Clicking ${selector}`);
    await this.page.waitForSelector(selector, { timeout: TIMEOUT });
    await this.page.click(selector);
    this.reporter.success('Clicked');
  }

  async typeSlashCommand(command) {
    this.reporter.step(`Using slash command: /${command}`);
    await this.page.keyboard.type(`/${command}`, { delay: 30 });
    await this.page.keyboard.press('Enter');
    this.reporter.success('Command executed');
  }

  async typeWithShiftEnter(text) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      await this.page.keyboard.type(lines[i]);
      if (i < lines.length - 1) {
        await this.page.keyboard.down('Shift');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.up('Shift');
      }
    }
  }

  async toggleEditorMode(expectedMode = null) {
    this.reporter.step('Toggling editor mode');
    const toggleBtn = await this.page.$('.editor-toggle-button');
    if (!toggleBtn) {
      throw new Error('Toggle button not found');
    }
    
    const beforeText = await toggleBtn.textContent();
    this.reporter.debug('Toggle button before', beforeText);
    
    await toggleBtn.click();
    
    if (expectedMode === 'MD') {
      await this.page.waitForSelector('.editor-textarea', { timeout: TIMEOUT });
      this.reporter.success('Switched to Markdown mode');
    } else if (expectedMode === 'BLK') {
      await this.page.waitForSelector('.bn-block-group, .editor-container', { timeout: TIMEOUT });
      this.reporter.success('Switched to BlockNote mode');
    } else {
      this.reporter.success('Editor mode toggled');
    }
  }

  async getMarkdownContent() {
    const content = await this.page.$eval('.editor-textarea', (el) => el.value || el.textContent || '');
    this.reporter.debug('Markdown content length', content.length);
    this.reporter.debug('Markdown preview', content.slice(0, 200));
    return content;
  }

  async getCodeBlockContents() {
    const contents = await this.page.$$eval('pre', (els) => els.map(el => el.textContent));
    this.reporter.debug('Code blocks found', contents.length);
    return contents;
  }

  async verifyNewlinesPreserved(content, label = 'content') {
    const hasNewlines = /\r?\n/.test(content);
    if (hasNewlines) {
      this.reporter.success(`Newlines preserved in ${label}`);
    } else {
      this.reporter.error(`Newlines NOT preserved in ${label}`);
      this.reporter.debug(`${label} content`, JSON.stringify(content.slice(0, 200)));
    }
    return hasNewlines;
  }

  async diagnosePageStructure(selectors) {
    this.reporter.step('Diagnosing page structure');
    for (const sel of selectors) {
      try {
        const count = await this.page.$$eval(sel, (els) => els.length);
        this.reporter.debug(`Selector: ${sel}`, `${count} element(s) found`);
      } catch (e) {
        this.reporter.debug(`Selector: ${sel}`, 'Error evaluating');
      }
    }
  }
}

/**
 * Main test runner
 */
export class TestRunner {
  constructor(suiteName) {
    this.reporter = new TestReporter(suiteName);
    this.serverManager = new ServerManager(this.reporter);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.browserHelper = null;
    this.startTime = null;
  }

  async setup() {
    this.startTime = Date.now();
    this.reporter.suiteStart();
    
    const baseURL = await this.serverManager.findOrStartServer();
    
    const isHeadless = process.env.HEADLESS !== 'false';
    this.reporter.step(`Launching browser (headless: ${isHeadless})`);
    this.browser = await chromium.launch({ headless: isHeadless });
    this.context = await this.browser.newContext({ baseURL });
    this.page = await this.context.newPage();
    this.browserHelper = new BrowserHelper(this.page, this.reporter);
    this.reporter.success('Browser launched');
    
    return baseURL;
  }

  async teardown(passed = true) {
    const duration = Date.now() - this.startTime;
    
    if (this.browser) {
      await this.browser.close();
    }
    this.serverManager.cleanup();
    
    this.reporter.suiteEnd(passed, duration);
  }

  async runTest(testName, testFn) {
    this.reporter.testStart(testName);
    try {
      await testFn(this.page, this.browserHelper, this.reporter);
      
      // Check for console errors at the end of the test
      if (this.browserHelper.hasConsoleErrors()) {
        const errors = this.browserHelper.getConsoleErrors();
        this.reporter.warning(`Test passed but had ${errors.length} console error(s)`);
        errors.forEach((err, i) => {
          this.reporter.debug(`Console error ${i + 1}`, err);
        });
        // Uncomment to fail tests on console errors:
        // throw new Error(`Test had ${errors.length} console error(s)`);
      }
      
      this.reporter.testEnd(true);
      return true;
    } catch (error) {
      this.reporter.testEnd(false);
      this.reporter.error(error.message);
      this.reporter.debug('Stack trace', error.stack);
      return false;
    }
  }
}

/**
 * Assertion helpers
 */
export const assert = {
  ok(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  },

  strictEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  },

  greaterThan(actual, threshold, message) {
    if (actual <= threshold) {
      throw new Error(message || `Expected ${actual} > ${threshold}`);
    }
  },

  includes(text, substring, message) {
    if (!text.includes(substring)) {
      throw new Error(message || `Expected text to include "${substring}"`);
    }
  },

  matches(text, pattern, message) {
    if (!pattern.test(text)) {
      throw new Error(message || `Expected text to match pattern ${pattern}`);
    }
  }
};

export { TIMEOUT, delay };
