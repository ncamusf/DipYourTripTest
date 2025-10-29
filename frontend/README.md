# Trip Brochure Generator - Frontend

A simple, modern frontend for uploading CSV files and generating trip brochures.

## Features

- 📁 Drag & drop or click to upload CSV files
- 🎨 Beautiful, responsive design
- ⚡ Real-time progress feedback
- 📱 Mobile-friendly interface
- ✅ Success and error handling

## Usage

1. Open `index.html` in your web browser
2. Upload a CSV file by:
   - Clicking on the upload area and selecting a file
   - Dragging and dropping a CSV file onto the upload area
3. Click "Generate Brochure" to process the file
4. Download your generated PDF when ready

## API Endpoint

The frontend sends the CSV file (encoded in base64) to:
```
https://us-central1-hemolyzer-ai-ca5bb.cloudfunctions.net/tripBrochureAgentGenerator
```

### Request Format

```json
{
  "csvBase64": "base64_encoded_csv_content"
}
```

### Expected Response

```json
{
  "pdfUrl": "https://storage.googleapis.com/..."
}
```

## Development

No build process required! Simply open `index.html` in a browser.

For local development with CORS:
- Use a local server like `python -m http.server 8000` or `npx serve`
- Or use browser extensions to disable CORS during development

## Files

- `index.html` - Main HTML structure
- `styles.css` - Modern, responsive styling
- `script.js` - File upload and API communication logic
- `README.md` - This file

