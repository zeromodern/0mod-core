# JSON to CSV Converter

A secure, browser-based utility to convert JSON data to CSV format.

**Live Demo:** [https://0mod.com/json-to-csv](https://0mod.com/json-to-csv)

## Features

- **Secure:** All processing happens locally in your browser. Your data is never uploaded to a server.
- **Simple UI:** Paste your JSON or upload a file.
- **Instant Conversion:** See the CSV output immediately.
- **Offline Ready:** Works without an internet connection once loaded.

## Feature Contract (E2E Requirements)

The following features are verified by automated tests in `tests/json-to-csv.spec.mjs`:

1.  **Tool Loading:** The application loads with the correct title and header.
2.  **Input:** Users can paste JSON text or upload a JSON file.
3.  **Validation:** Invalid JSON triggers an error message.
4.  **Conversion:** Valid JSON is converted to CSV format.
5.  **Download:** Users can download the resulting CSV file.
6.  **Copy to Clipboard:** Users can copy the CSV output to their clipboard.

## How to Use

1. Paste your JSON data into the input area or upload a `.json` file.
2. The tool will automatically convert it to CSV.
3. Click "Download CSV" to save the file or "Copy" to copy the text.
