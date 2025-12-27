Contributing to 0mod

Thank you for helping us build privacy-first tools! Because we separate our "Platform" logic from our "Tool" logic, contributing is very simple.

## How to Run a Tool

You do not need to install Node.js, NPM, or run a build server to test these tools.

1. Clone this repository.

2. Navigate to `apps/[tool-name]`.

3. Open `index.html` in your browser.

4. That's it.

## Creating a New Tool

We use a standard "DNA" for all tools to ensure they feel consistent.

1. **Copy the Template:** Duplicate `_template/index.html` (if available) or an existing tool.

2. **Single File Only:** Keep CSS, JS, and HTML in one file.

3. **Use Tailwind:** Use standard Tailwind utility classes.

4. **No External Calls:** Do not use `fetch()` to external APIs unless absolutely necessary (and documented). The tool must work offline.

5. **State:** Use `localStorage` to save user inputs so they don't lose work on refresh.

## Submitting a PR

* Ensure your tool works in Chrome and Safari.
* Do not include any build artifacts (minified code).
* Keep the `<script src="cdn.tailwindcss.com">` tag in the head. Our production build system will automatically replace this with optimized CSS.

## "Where is the Navbar?"

You will notice the tools here do not have the 0mod Navbar or Footer. This is intentional. The "Chrome" (branding) is injected during our deployment process. Please focus only on the tool functionality inside the main container.