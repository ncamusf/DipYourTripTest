# 🌐 Dip Your Trip - Frontend

A beautiful, modern web interface for uploading CSV trip data and generating AI-powered trip brochures. Built with vanilla JavaScript for simplicity and performance.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Running Locally](#running-locally)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [File Structure](#file-structure)
- [API Integration](#api-integration)
- [Customization](#customization)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Dip Your Trip frontend provides an intuitive, drag-and-drop interface for users to:
1. Upload CSV files containing trip add-on data
2. Submit the data for processing
3. Monitor generation progress in real-time
4. Download the generated PDF brochure

**No build process, no dependencies, no framework** - just pure HTML, CSS, and JavaScript!

## ✨ Features

- 📁 **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- 🎨 **Beautiful Design**: Modern, responsive UI with smooth animations
- ⚡ **Real-time Feedback**: Progress indicators and status updates
- 📱 **Mobile-Friendly**: Fully responsive design for all screen sizes
- ✅ **Error Handling**: Clear error messages and retry functionality
- 🖼️ **Brand Integration**: Professional logo and branded design
- 🎭 **Visual States**: Clear visual feedback for different states (idle, processing, success, error)
- ♿ **Accessibility**: ARIA labels and keyboard navigation support

### UI States

The interface handles multiple states elegantly:
- **Initial**: Ready for file upload
- **File Selected**: Shows file name with clear option
- **Processing**: Animated progress bar with estimated time
- **Success**: Download link and option for new upload
- **Error**: Clear error message with retry option

## 🚀 Quick Start

### Immediate Use (No Setup Required)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

3. Upload a CSV file and generate your brochure!

**Note:** Opening directly may cause CORS issues with the API. For best experience, use a local server (see below).

## 💻 Running Locally

### Option 1: Python HTTP Server (Recommended)

```bash
cd frontend

# Python 3
python -m http.server 8000

# Python 2 (if you have it)
python -m SimpleHTTPServer 8000
```

Open `http://localhost:8000` in your browser.

### Option 2: Node.js Serve

```bash
cd frontend

# Using npx (no installation)
npx serve -p 8000

# Or install globally first
npm install -g serve
serve -p 8000
```

Open `http://localhost:8000` in your browser.

### Option 3: PHP Built-in Server

```bash
cd frontend
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

### Option 4: VS Code Live Server

If you're using Visual Studio Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 5: Any Static Server

Use any static file server of your choice:
- **http-server**: `npx http-server -p 8000`
- **browser-sync**: `npx browser-sync start --server --files "*.html, *.css, *.js"`

## 📖 Usage Guide

### Step-by-Step Instructions

#### 1. Prepare Your CSV File

Create a CSV file with your trip add-ons in this format:

```csv
Name,Description,Price
Wine Tasting Tour,Experience local vineyards and taste premium wines,150
Beach Excursion,Relax on pristine beaches with water activities,75
Hiking Adventure,Explore mountain trails with expert guides,120
Desert Safari,Thrilling desert adventure with dune bashing,200
```

**CSV Requirements:**
- **Headers**: Must have `Name`, `Description`, and `Price` columns
- **Format**: Standard CSV with comma separators
- **Encoding**: UTF-8
- **Size**: Reasonable file size (< 10MB recommended)
- **Rows**: At least one trip add-on

#### 2. Upload the File

**Method A - Click to Upload:**
1. Click on the upload area
2. Select your CSV file from the file picker
3. The file name will appear below the upload area

**Method B - Drag and Drop:**
1. Drag your CSV file from your file system
2. Drop it onto the upload area
3. The file name will appear below the upload area

#### 3. Generate Brochure

1. Click the "Generate Brochure" button
2. Wait for processing (typically 1-2 minutes)
3. You'll see a progress bar with a status message

#### 4. Download Your PDF

1. When complete, a success message appears
2. Click "Download PDF" to get your brochure
3. Or click "Upload Another File" to create more brochures

### What Happens During Processing

1. **File Validation**: CSV format is checked
2. **Upload**: Data is sent to the backend API
3. **AI Analysis**: LLM analyzes trip content
4. **Image Selection**: Appropriate images are selected
5. **PDF Generation**: Professional brochure is created
6. **Upload**: PDF is uploaded to cloud storage
7. **Completion**: Download link is provided

## ⚙️ Configuration

### Changing the API Endpoint

Edit `script.js` to point to your backend:

```javascript
// For production (Firebase Functions)
const API_ENDPOINT = 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/tripBrochureAgentGenerator';

// For local development (Firebase Emulator)
const API_ENDPOINT = 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/tripBrochureAgentGenerator';
```

**Current endpoint:**
```javascript
const API_ENDPOINT = 'https://us-central1-hemolyzer-ai-ca5bb.cloudfunctions.net/tripBrochureAgentGenerator';
```

### Customizing Timeout

Adjust the timeout for API calls in `script.js`:

```javascript
// Default: No timeout
// Add timeout if needed:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes

fetch(API_ENDPOINT, {
  // ... other options
  signal: controller.signal
});
```

## 📁 File Structure

```
frontend/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Upload logic and API communication
├── logo/
│   └── dipLogo.png    # Brand logo
└── README.md          # This file
```

### File Descriptions

**index.html** (83 lines)
- Semantic HTML5 structure
- Accessibility features (ARIA labels)
- Upload form and file handling
- Progress and result sections

**styles.css** (384 lines)
- Modern, responsive design
- CSS animations and transitions
- Mobile-first approach
- Custom color scheme and typography

**script.js** (170 lines)
- File upload handling
- Drag-and-drop functionality
- API communication
- State management
- Error handling

## 🔌 API Integration

### Request Format

The frontend sends data to the backend as:

```javascript
POST /tripBrochureAgentGenerator
Content-Type: application/json

{
  "csvData": "Name,Description,Price\nWine Tasting,Premium wine experience,150"
}
```

### Response Handling

**Success Response:**
```javascript
{
  "url": "https://storage.googleapis.com/...",
  "message": "PDF brochure generated successfully"
}
```

**Error Response:**
```javascript
{
  "error": "Error message describing the issue"
}
```

### Error Handling in Frontend

The frontend handles various error scenarios:

```javascript
// Network errors
catch (error) {
  if (error.message.includes('Failed to fetch')) {
    showError('Network error. Please check your connection.');
  }
}

// HTTP errors
if (!response.ok) {
  showError(`Server error: ${data.error || 'Unknown error'}`);
}

// Invalid response
if (!data.url) {
  showError('Invalid response from server');
}
```

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #2563eb;      /* Main blue */
  --primary-dark: #1e40af;       /* Darker blue */
  --success-color: #10b981;      /* Green for success */
  --error-color: #ef4444;        /* Red for errors */
  --text-color: #1f2937;         /* Dark gray */
  --text-muted: #6b7280;         /* Light gray */
}
```

### Updating Logo

Replace `logo/dipLogo.png` with your own logo. Recommended specs:
- Format: PNG with transparency
- Size: 200-400px width
- Aspect ratio: Any (will scale proportionally)

### Modifying Upload Area

Edit the upload section in `index.html`:

```html
<label for="csvFile" class="file-label" id="fileLabel">
  <!-- Change icon, text, or styling here -->
  <span class="label-text">Your Custom Text</span>
</label>
```

### Adding More File Types

Currently accepts only CSV. To add more:

```html
<!-- In index.html -->
<input 
  type="file" 
  id="csvFile" 
  accept=".csv,.txt,.xlsx"  <!-- Add more types -->
  class="file-input"
>
```

```javascript
// In script.js - add validation
if (!file.name.match(/\.(csv|txt|xlsx)$/)) {
  showError('Please upload a valid file');
  return;
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Initialize Firebase in the project root (if not done)
firebase init hosting

# Select the 'frontend' directory as your public directory
# Configure as single-page app: No
# Set up automatic builds: No

# Deploy
firebase deploy --only hosting
```

### Deploy to Netlify

**Option 1 - Drag & Drop:**
1. Go to [Netlify](https://www.netlify.com/)
2. Drag the `frontend/` folder to the upload area
3. Your site is live!

**Option 2 - CLI:**
```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod
```

### Deploy to Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Create a new branch
git checkout -b gh-pages

# Push frontend to the branch
git subtree push --prefix frontend origin gh-pages

# Enable GitHub Pages in repository settings
# Select 'gh-pages' branch as source
```

### Deploy to Any Static Host

The frontend can be deployed to any static hosting service:
- **AWS S3**: Upload files to S3 bucket with static website hosting
- **Azure Static Web Apps**: Deploy via Azure portal or CLI
- **Cloudflare Pages**: Connect Git repo or use direct upload
- **Google Cloud Storage**: Create bucket with website configuration

Simply upload the three files (`index.html`, `styles.css`, `script.js`) and the `logo/` directory.

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem:** "Access to fetch blocked by CORS policy"

**Solution:**
- Use a local server instead of opening file directly
- Ensure backend has CORS enabled (already configured)
- Check that API endpoint URL is correct

#### 2. File Won't Upload

**Problem:** "Generate Brochure" button stays disabled

**Solution:**
- Check that file is a valid CSV
- Try clearing and re-uploading the file
- Check browser console for errors
- Verify CSV has correct headers (Name, Description, Price)

#### 3. Long Wait Times

**Problem:** Processing takes too long or times out

**Solution:**
- Wait at least 2-3 minutes (normal processing time)
- Check backend logs for issues
- Verify backend has sufficient resources (memory/timeout)
- Try with a smaller CSV file

#### 4. Download Button Not Working

**Problem:** PDF doesn't download when clicking button

**Solution:**
- Check if browser is blocking pop-ups
- Try right-click and "Save Link As"
- Verify the PDF URL in the response is valid
- Check browser console for errors

#### 5. Styling Issues

**Problem:** Layout looks broken

**Solution:**
- Clear browser cache
- Check that `styles.css` is loaded (view page source)
- Verify no browser extensions are interfering
- Try a different browser

### Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note:** Internet Explorer is not supported.

### Debugging

Enable detailed logging in `script.js`:

```javascript
// Add at the top of script.js
const DEBUG = true;

// Add throughout code
if (DEBUG) console.log('File selected:', file);
if (DEBUG) console.log('API response:', data);
```

Check browser console (F12) for:
- Network requests (Network tab)
- JavaScript errors (Console tab)
- Element inspection (Elements tab)

## 📊 Performance

### Metrics

- **Initial Load**: < 100ms (3 small files + 1 image)
- **File Selection**: Instant
- **Upload Start**: < 50ms
- **Processing**: 60-120 seconds (backend dependent)
- **Total Time**: ~1-2 minutes end-to-end

### Optimization Tips

Already optimized:
- ✅ No external dependencies
- ✅ Minimal file sizes
- ✅ CSS animations use GPU acceleration
- ✅ Async/await for better UX
- ✅ Responsive images

Further optimization:
- Add service worker for offline support
- Implement request caching
- Add image lazy loading if multiple images added

## 🔒 Security

### Current Security Measures

- File type validation
- Client-side CSV format checking
- No direct file system access
- HTTPS for API calls (in production)

### Best Practices

- Never store sensitive data in frontend code
- Always validate on backend (frontend validation is for UX only)
- Use HTTPS in production
- Sanitize any user-visible error messages

## 📝 Sample CSV Files

### Example 1: Basic Trip

```csv
Name,Description,Price
City Tour,Explore historic city center with local guide,50
Museum Visit,Visit world-renowned art museum,30
```

### Example 2: Adventure Trip

```csv
Name,Description,Price
Mountain Hiking,Full-day trek through scenic mountain trails,120
Rock Climbing,Half-day climbing session with equipment,95
Zip Line Adventure,Thrilling zip line experience over canyon,80
```

### Example 3: Luxury Trip

```csv
Name,Description,Price
Wine Tasting,Private vineyard tour with wine expert,200
Spa Day,Full day luxury spa treatment,350
Gourmet Dinner,Michelin-star restaurant experience,180
Private Yacht,Half-day private yacht charter,500
```

## 🤝 Contributing

To contribute to the frontend:

1. Test your changes in multiple browsers
2. Ensure responsive design works on mobile
3. Check console for any errors
4. Verify accessibility (screen readers, keyboard navigation)
5. Update this README if needed

## 📄 License

[Add your license information here]

---

**Questions?** Open an issue or contact the development team.

**Enjoy creating beautiful trip brochures! ✈️🌍**
