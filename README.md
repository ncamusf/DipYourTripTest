# 🌍 Dip Your Trip - AI-Powered Trip Brochure Generator

Transform CSV trip data into beautiful, AI-powered PDF brochures automatically.


## 🧪 Quick Test (No Setup Required)

You can test the application immediately without any backend setup:

**The backend is already deployed and the frontend points to production.**

Simply run the frontend locally:

```bash
cd frontend
python -m http.server 8000
# Then open http://localhost:8000
```

Upload a CSV file and generate your brochure - it just works!

## 🎯 Overview

**Dip Your Trip** automates travel brochure creation with AI:
- Upload CSV with trip activities → Get professional PDF brochure
- AI selects perfect images and generates beautiful layouts
- Fully serverless on Firebase with Google Cloud Storage

## ✅ Prerequisites

- **Node.js** >= 18.0.0
- **npm** (comes with Node.js)
- **Firebase CLI**: `npm install -g firebase-tools`
- **Google Cloud Project** with Firebase and Cloud Storage enabled

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd dipyourtrip

# Backend setup
cd backend
npm install

# Frontend (no installation needed)
```

### 2. Configure Firebase

```bash
cd backend
firebase login
# Ensure your Firebase project is configured with Cloud Storage
```

## 💻 Running Locally

### Backend (Firebase Emulator)

```bash
cd backend
npm run serve
```

### Frontend

```bash
cd frontend

# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx serve -p 8000

# Then open http://localhost:8000
```

**Important:** Update `frontend/script.js` with your local endpoint if using emulator:
```javascript
const API_ENDPOINT = 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/tripBrochureAgentGenerator';
```

## 🎬 Triggering the Full Flow

### Via Web UI (Easiest)

1. **Open** `http://localhost:8000` in browser
2. **Create CSV file** with format:
   ```csv
   Name,Description,Price
   Wine Tasting,Premium wine experience,150
   Beach Day,Relax on pristine beaches,75
   Hiking,Mountain trails with guides,120
   ```
3. **Upload** via drag-and-drop or click
4. **Click** "Generate Brochure"
5. **Wait** 1-2 minutes for processing
6. **Download** your PDF!

### Via API (Direct)

```bash
curl -X POST https://us-central1-hemolyzer-ai-ca5bb.cloudfunctions.net/tripBrochureAgentGenerator \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": "Name,Description,Price\nWine Tasting,Premium wine experience,150\nBeach Day,Relaxing beach excursion,75"
  }'
```

**Response:**
```json
{
  "url": "https://storage.googleapis.com/your-bucket/trip-brochure-timestamp.pdf",
  "message": "PDF brochure generated successfully"
}
```

## 📄 Sample PDF Output

**Example PDF URL:** `https://storage.googleapis.com/dyt-challenge-pdfs/candidates/NicoCamus/patagonia-adventure-trek-2025-10-29T22-50-25.pdf`

The generated PDF includes:
- Professional layout with your logo
- AI-selected images matching trip themes
- All activities with descriptions and pricing
- Optimized for print and digital viewing

## 📁 Project Structure

```
dipyourtrip/
├── backend/              # Firebase Functions (TypeScript)
│   ├── src/
│   │   ├── functions/   # Main cloud function
│   │   ├── generators/  # PDF & HTML generation
│   │   └── externalServices/ # LLM, Storage, etc.
│   └── README.md        # Detailed backend docs
│
├── frontend/            # Web UI (HTML/CSS/JS)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── README.md        # Detailed frontend docs
│
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Firebase Functions (Node.js/TypeScript)
- **PDF Generation**: Puppeteer + Chromium
- **AI/LLM**: Custom LLM integration
- **Storage**: Google Cloud Storage
- **Image Processing**: Sharp

## 🧪 Testing

```bash
cd backend
npm test                 # Run tests
npm run test:watch      # Watch mode
```

## 🚀 Deployment

```bash
# Deploy backend
cd backend
npm run build
firebase deploy --only functions

```

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Use local server, don't open HTML directly |
| Function timeout | Wait 2-3 minutes, check backend logs |
| CSV not accepted | Ensure headers: Name, Description, Price |
| Button disabled | Check file is valid CSV format |

**More details:** See `backend/README.md` and `frontend/README.md`

## 📚 Documentation

- **[Backend README](backend/README.md)** - API docs, deployment, configuration
- **[Frontend README](frontend/README.md)** - UI guide, customization, deployment

## 📝 CSV Format

```csv
Name,Description,Price
Activity Name,Activity Description,Numeric Price
Wine Tasting,Experience local vineyards,150
```

**Required columns:** Name, Description, Price

## 📞 Support

For detailed documentation, see the README files in `backend/` and `frontend/` folders.

---
