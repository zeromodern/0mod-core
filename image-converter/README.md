# Image Converter Tool

A secure, browser-based utility to convert images between different formats.

**Live Demos:**
- [Convert to PDF](https://0mod.com/convert-to-pdf)
- [Scrub Image Data (Remove EXIF)](https://0mod.com/scrub-image-data)
- [JPEG to PNG](https://0mod.com/jpeg-to-png)
- [HEIC to JPEG](https://0mod.com/heic-to-jpeg)
- [WEBP to PNG](https://0mod.com/webp-to-png)
- ...and many more combinations on [0mod.com](https://0mod.com).

## Features

- **Secure:** All processing happens locally in your browser. Your files are never uploaded to a server.
- **Simple UI:** Drag and drop files or use the file picker.
- **Multiple Formats:** Supports JPEG, PNG, WEBP, HEIC, TIFF, BMP, GIF, and PDF conversion.
- **Fast:** Powered by Canvas API and specialized libraries for efficient image manipulation.
- **Offline Ready:** Works without an internet connection once loaded.

## Feature Contract (E2E Requirements)

The following features are verified by automated tests in `tests/image-converter.spec.mjs`:

1.  **Tool Loading:** The application loads with the correct title and header.
2.  **Format Selection:** Users can select input and output formats from dropdown menus.
3.  **File Selection:** Users can select an image file via the file picker or drag-and-drop.
4.  **Convert Action:** The "Convert" button is enabled when a file is selected.
5.  **Output Generation:** Clicking "Convert" generates a downloadable converted image.
6.  **Download:** A download button appears after successful conversion.

## How to Use

1. Select the input format (or "All" to accept any image) and desired output format.
2. Upload an image file by dragging and dropping or using the file picker.
3. Click "Convert" to process the image.
4. Download your converted image using the "Download" button.