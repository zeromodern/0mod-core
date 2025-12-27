# 0mod Core Tools

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Tests](https://github.com/zeromodern/0mod-core/actions/workflows/test.yml/badge.svg)](https://github.com/zeromodern/0mod-core/actions/workflows/test.yml)

**Zero Server. Pure Utility.**

The open-source engine behind [0mod.com](https://0mod.com).

- **Live Tools**: [0mod.com](https://0mod.com)
- **Consulting & Support**: [Zero Modern](https://zeromodern.com)

## Usage (Simple)

You can use these tools directly without any installation:

1.  **Open in Browser**: Just open the `index.html` file in any app folder (e.g., `apps/pdf-merge/index.html`) in your browser.
2.  **Local Server**: Run `./dev.sh` (Mac/Linux) or `dev.bat` (Windows) to start a local server at `http://localhost:8000`.

## Advanced (Developers)

For contributors or running the test suite:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Run tests
npm test
```

## Philosophy

We believe in **"Zero Server"** architecture.

* **Privacy First:** All logic runs client-side. No data is sent to the cloud.
* **Remixable:** The source code is clean, single-file HTML/JS. No obfuscation.
* **Offline:** These tools work without an internet connection.

## "Open Core" Architecture

This repository (`0mod-core`) contains the raw tool logic.

* **Standalone:** Each tool in `/apps` is a fully functional HTML file. You can download it, disconnect your internet, and it will work.
* **No Build Step:** We use Tailwind CSS via CDN in development so you can open files directly in your browser to test them.
* **Production:** The hosted version on 0mod.com uses a private build pipeline to inject our branding, ads, and offline CSS caching, but the *logic* you see here is exactly what runs in production.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

[Apache-2.0](./LICENSE)
