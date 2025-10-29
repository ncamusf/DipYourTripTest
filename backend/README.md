# 🚀 Dip Your Trip - Backend

Firebase Functions backend for AI-powered trip brochure generation. This service processes CSV trip data, analyzes it with LLM, selects appropriate images, and generates professional PDF brochures.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Configuration](#configuration)

## 🎯 Overview

The backend is a Firebase Cloud Function that orchestrates the entire PDF generation pipeline:

1. **CSV Parsing**: Validates and parses trip add-on data from CSV format
2. **LLM Analysis**: Uses AI to analyze trip content and select matching images
3. **Image Processing**: Downloads and optimizes images from Google Cloud Storage
4. **PDF Generation**: Creates professional brochures using Puppeteer and HTML templates
5. **Cloud Upload**: Uploads final PDF to Google Cloud Storage and returns public URL

### Key Features

- ⚡ **Serverless**: Runs on Firebase Functions (no server management)
- 🤖 **AI-Powered**: LLM integration for intelligent content analysis
- 🖼️ **Image Optimization**: Automatic image compression using Sharp
- 📄 **PDF Generation**: High-quality PDFs with Puppeteer/Chromium
- ☁️ **Cloud Storage**: Seamless integration with Google Cloud Storage
- 🧪 **Fully Tested**: Comprehensive test suite with Jest
- 📝 **TypeScript**: Type-safe code with full TypeScript support

## ✅ Prerequisites

- **Node.js** >= 18.0.0
- **npm** (included with Node.js)
- **Firebase CLI**: `npm install -g firebase-tools`
- **Google Cloud Project** with:
  - Firebase enabled
  - Cloud Storage bucket
  - Appropriate IAM permissions

### Environment Setup

Ensure you have:
- Firebase project initialized
- Google Cloud Storage bucket with trip images
- LLM API credentials configured (if applicable)

## 📦 Installation

```bash
# Clone and navigate to backend directory
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build
```

## 💻 Running Locally

### Option 1: Firebase Emulator (Recommended)

Run the function locally with Firebase emulator:

```bash
npm run serve
```

This will:
- Build the TypeScript code
- Start Firebase Functions emulator
- Make your function available at `http://localhost:5001/YOUR-PROJECT-ID/us-central1/tripBrochureAgentGenerator`

The emulator provides:
- Local testing without deploying
- Faster iteration cycles
- Cloud Functions UI at `http://localhost:4000`

### Option 2: Direct Node Execution

For testing specific components:

```bash
# Build the project
npm run build

# Run the compiled JavaScript
node dist/index.js
```

### Testing the Function Locally

Once the emulator is running, test with curl:

```bash
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/tripBrochureAgentGenerator \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": "Name,Description,Price\nWine Tasting,Premium wine tasting experience,150\nBeach Day,Relaxing beach excursion,75"
  }'
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript in `dist/` |
| `npm start` | Build and run the application directly |
| `npm run serve` | Build and start Firebase emulators |
| `npm run shell` | Open interactive Firebase Functions shell |
| `npm test` | Run test suite with Jest |
| `npm run test:watch` | Run tests in watch mode for development |

### Script Details

**Build:**
```bash
npm run build
```
Compiles all TypeScript files from `src/` to JavaScript in `dist/`.

**Serve (Local Development):**
```bash
npm run serve
```
Best for local development - runs function in Firebase emulator with hot reload.

**Test:**
```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── externalServices/           # External API integrations
│   │   ├── googleBucket.ts        # Google Cloud Storage operations
│   │   │   ├── getImageNameFromBucket()    # List images in bucket
│   │   │   ├── getImageUrlsFromBucket()    # Get signed URLs
│   │   │   └── downloadAndOptimizeImages() # Download & optimize
│   │   ├── llmService.ts          # LLM/AI integration
│   │   │   └── analyzeTripWithLLM()        # AI analysis
│   │   └── pdfUploadService.ts    # PDF upload to storage
│   │       └── uploadPdf()                  # Upload generated PDF
│   │
│   ├── functions/
│   │   └── tripBrochureAgentGenerator.ts   # Main cloud function
│   │       ├── processTripData()           # Orchestrate AI & images
│   │       ├── generateBrochure()          # Create PDF
│   │       └── tripBrochureGeneratorProcess() # Main handler
│   │
│   ├── generators/
│   │   ├── htmlGenerator.ts       # HTML template generation
│   │   │   └── generateBrochureHTML()      # Create HTML from data
│   │   └── pdfService.ts          # PDF creation with Puppeteer
│   │       └── generateBrochureFile()      # HTML → PDF
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── tripData.ts           # Trip data types
│   │   ├── llmTypes.ts           # LLM request/response types
│   │   └── imageData.ts          # Image metadata types
│   │
│   ├── utils/                    # Helper utilities
│   │   └── utils.ts
│   │       ├── validateAndParseCsvData()   # CSV validation
│   │       └── cleanupDirectory()          # Temp file cleanup
│   │
│   └── index.ts                  # Entry point (exports functions)
│
├── test/                         # Test files
│   ├── services/
│   │   └── googleBucket.test.ts # Storage tests
│   └── utils/
│       ├── utils.test.ts        # Utility function tests
│       └── trip1.csv            # Sample test data
│
├── pdfTempleate/                # PDF template assets
│   └── images/
│       ├── icons/               # Activity icons
│       │   ├── airplane.png
│       │   ├── beach.png
│       │   ├── desert.png
│       │   ├── lake.png
│       │   ├── stars.png
│       │   ├── trekking.png
│       │   └── wine.png
│       ├── logo/
│       │   └── dipLogo.png     # Brand logo
│       └── tempPhotos/         # Temporary downloaded images
│
├── dist/                        # Compiled JavaScript (generated)
├── firebase.json                # Firebase configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── jest.config.js              # Jest test configuration
```

## 🔌 API Documentation

### Main Endpoint: `tripBrochureAgentGenerator`

**HTTP Method:** `POST`

**Deployed URL:**
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/tripBrochureAgentGenerator
```

**Local URL (Emulator):**
```
http://localhost:5001/YOUR-PROJECT-ID/us-central1/tripBrochureAgentGenerator
```

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "csvData": "Name,Description,Price\nWine Tasting,Premium wine experience,150\nBeach Day,Relaxing beach excursion,75"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| csvData | string | Yes | CSV-formatted trip add-on data |

**CSV Format:**
```csv
Name,Description,Price
Activity Name,Activity Description,Numeric Price
```

#### Response

**Success (200):**
```json
{
  "url": "https://storage.googleapis.com/your-bucket/trip-brochure-timestamp.pdf",
  "message": "PDF brochure generated successfully"
}
```

**Error (400 - Bad Request):**
```json
{
  "error": "No CSV data provided"
}
```

**Error (500 - Internal Server Error):**
```json
{
  "error": "Error message describing what went wrong"
}
```

#### Configuration

The function is configured with:
- **Timeout**: 540 seconds (9 minutes)
- **Memory**: 2GiB
- **CORS**: Enabled for all origins
- **Region**: us-central1

### Example: cURL Request

```bash
curl -X POST https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/tripBrochureAgentGenerator \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": "Name,Description,Price\nWine Tasting Tour,Experience local vineyards and taste premium wines,150\nBeach Excursion,Relax on pristine beaches with water activities,75\nHiking Adventure,Explore mountain trails with expert guides,120"
  }'
```

### Example: JavaScript/Fetch

```javascript
const response = await fetch(
  'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/tripBrochureAgentGenerator',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      csvData: 'Name,Description,Price\nWine Tasting,Premium wine experience,150'
    })
  }
);

const result = await response.json();
console.log('PDF URL:', result.url);
```

## 🧪 Testing

The project uses Jest for testing.

### Run Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Run specific test file
npm test -- googleBucket.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Structure

```
test/
├── services/
│   └── googleBucket.test.ts    # Tests for Cloud Storage operations
└── utils/
    ├── utils.test.ts           # Tests for utility functions
    └── trip1.csv              # Sample CSV for testing
```

### Writing Tests

Example test structure:

```typescript
import { validateAndParseCsvData } from '../utils/utils';

describe('CSV Validation', () => {
  it('should parse valid CSV data', () => {
    const csvData = 'Name,Description,Price\nWine Tasting,Great experience,150';
    const result = validateAndParseCsvData(csvData);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Wine Tasting');
  });

  it('should throw error for invalid CSV', () => {
    expect(() => {
      validateAndParseCsvData('invalid data');
    }).toThrow();
  });
});
```

## 🚀 Deployment

### Prerequisites for Deployment

1. Firebase project set up
2. Firebase CLI installed and authenticated
3. Billing enabled on your Google Cloud project

### Deploy to Firebase

```bash
# Build the project
npm run build

# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:tripBrochureAgentGenerator

# Deploy with a message
firebase deploy --only functions -m "Updated PDF generation logic"
```

### Deployment Checklist

- [ ] Run tests: `npm test`
- [ ] Build successfully: `npm run build`
- [ ] Check for linting errors
- [ ] Update environment variables if needed
- [ ] Review function configuration (timeout, memory)
- [ ] Test locally with emulator first
- [ ] Deploy to staging/dev environment first (if available)
- [ ] Deploy to production
- [ ] Verify function is working in production

### Post-Deployment Verification

```bash
# Check function logs
firebase functions:log --only tripBrochureAgentGenerator

# Test the deployed function
curl -X POST https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/tripBrochureAgentGenerator \
  -H "Content-Type: application/json" \
  -d '{"csvData": "Name,Description,Price\nTest,Testing deployment,99"}'
```

## ⚙️ Configuration

### Firebase Configuration

Edit `firebase.json`:

```json
{
  "functions": {
    "source": ".",
    "runtime": "nodejs18",
    "ignore": [
      "node_modules",
      ".git",
      "*.local",
      "test"
    ]
  }
}
```

### TypeScript Configuration

Key settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  }
}
```

### Environment Variables

Set environment variables for Firebase Functions:

```bash
# Set a config value
firebase functions:config:set llm.api_key="YOUR_API_KEY"

# View current config
firebase functions:config:get

# Deploy config changes
firebase deploy --only functions
```

Access in code:
```typescript
import { defineString } from 'firebase-functions/params';
const apiKey = defineString('LLM_API_KEY');
```

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript compilation errors:**
```bash
npm run build
# Check tsconfig.json settings
```

**Function timeout:**
- Increase timeout in function configuration (max 540s)
- Optimize image processing
- Check LLM response times

**Out of memory:**
- Increase memory allocation in function config
- Optimize image sizes before processing
- Check for memory leaks

**Firebase emulator not starting:**
```bash
# Kill existing processes
firebase emulators:stop

# Clear Firebase cache
firebase logout
firebase login
```

### Debugging

Enable detailed logging:

```typescript
import { logger } from 'firebase-functions/v2';

logger.debug('Debug message', { data: someData });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

View logs:
```bash
# Real-time logs
firebase functions:log

# Specific function
firebase functions:log --only tripBrochureAgentGenerator
```

## 📊 Performance Optimization

### Current Performance

- **Cold start**: ~5-10 seconds
- **Warm execution**: ~60-120 seconds
- **Image processing**: ~10-20 seconds per image
- **PDF generation**: ~20-30 seconds

### Optimization Tips

1. **Keep functions warm**: Use scheduled pings
2. **Optimize images**: Pre-optimize images in storage
3. **Reduce dependencies**: Minimize package size
4. **Cache LLM responses**: For repeated trips
5. **Parallel processing**: Download images concurrently

## 📝 Dependencies

### Production Dependencies

- `@google-cloud/functions-framework`: ^3.3.0 - Run functions locally
- `@sparticuz/chromium`: ^131.0.0 - Headless Chrome for Puppeteer
- `firebase-functions`: ^6.6.0 - Firebase Functions SDK
- `puppeteer-core`: ^24.15.0 - PDF generation
- `sharp`: ^0.33.0 - Image optimization

### Development Dependencies

- `typescript`: ^5.3.0 - TypeScript compiler
- `jest`: ^29.5.0 - Testing framework
- `ts-jest`: ^29.1.0 - TypeScript support for Jest
- `firebase-admin`: ^12.0.0 - Admin SDK for testing
- `firebase-tools`: ^13.0.0 - Firebase CLI

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Run `npm test` to ensure all tests pass
5. Run `npm run build` to check for TypeScript errors
6. Submit a pull request

## 📄 License

[Add your license information here]

---

**Need help?** Open an issue or contact the development team.
