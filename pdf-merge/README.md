# PDF Merge Tool

A secure, browser-based utility to merge multiple PDF files into a single document.

**Live Demo:** [https://0mod.com/pdf-merge](https://0mod.com/pdf-merge)

## Features

- **Secure:** All processing happens locally in your browser. Your files are never uploaded to a server.
- **Simple UI:** Drag and drop files or use the file picker.
- **Reorder:** Easily change the order of files before merging.
- **Fast:** Powered by `pdf-lib` for efficient PDF manipulation.
- **Offline Ready:** Works without an internet connection once loaded.

## Feature Contract (E2E Requirements)

The following features are verified by automated tests in `tests/tool.spec.mjs`:

1.  **Tool Loading:** The application loads with the correct title and header.
2.  **File Selection:** Users can select multiple PDF files via the file picker or drag-and-drop.
3.  **File Listing:** Selected files are displayed in a list with their names and sizes.
4.  **Merge Action:** The "Merge PDFs" button is enabled when at least two files are selected.
5.  **Output Generation:** Clicking "Merge PDFs" generates a downloadable PDF file.
6.  **Download:** A download link appears after successful merging.

## How to Use

1. Select or drag and drop the PDF files you want to merge.
2. Use the "Up" and "Down" buttons to arrange them in the desired order.
3. Click "Merge PDFs".
4. Download your combined document.
