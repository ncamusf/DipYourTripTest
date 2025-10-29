import { logger } from 'firebase-functions/v2';
import * as path from 'path';
import * as fs from 'fs';
import { TripBrochureData } from '../types/tripData';
import { generateHTML } from './htmlGenerator';



export async function generateBrochureFile(
  tripBrochureData: TripBrochureData
): Promise<string> {
  const html = generateHTML(tripBrochureData);
  const outputDir = path.join(process.cwd(), 'pdfs');
  const filename = generatePdfFilename(tripBrochureData.tripTitle);
  const outputPath = path.join(outputDir, filename);
  
  const pdfPath = await generatePDFFile(html, outputPath, {
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });
  return pdfPath;
}

function generatePdfFilename(tripTitle: string): string {
  const sanitizedTitle = tripTitle
    .replace(/[^a-zA-Z0-9\s-]/g, '') 
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${sanitizedTitle}-${timestamp}.pdf`;
}

function imageToBase64DataUri(imagePath: string): string {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';
    
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    logger.warn(`Failed to convert image to base64: ${imagePath}`, error);
    return '';
  }
}

function embedImagesAsBase64(htmlContent: string, baseDir: string): string {
  let processedHtml = htmlContent;
  
  const srcPattern = /src="images\/([^"]+)"/g;
  const urlPattern = /url\('images\/([^']+)'\)/g;
  
  processedHtml = processedHtml.replace(srcPattern, (match, imagePath) => {
    const fullPath = path.join(baseDir, 'images', imagePath);
    
    if (fs.existsSync(fullPath)) {
      const dataUri = imageToBase64DataUri(fullPath);
      return `src="${dataUri}"`;
    } else {
      logger.error(`✗ Image not found: ${fullPath}`);
      return match;
    }
  });
  
  processedHtml = processedHtml.replace(urlPattern, (match, imagePath) => {
    const fullPath = path.join(baseDir, 'images', imagePath);
    
    if (fs.existsSync(fullPath)) {
      const dataUri = imageToBase64DataUri(fullPath);
      return `url('${dataUri}')`;
    } else {
      logger.error(`✗ Background image not found: ${fullPath}`);
      return match;
    }
  });
  return processedHtml;
}

export async function generatePDFFile(
    htmlContent: string,
    outputPath: string,
    options: {
      format?: 'A4' | 'Letter' | 'Legal';
      landscape?: boolean;
      margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
      printBackground?: boolean;
    } = {}
  ): Promise<string> {
    try {
      const puppeteer = await import('puppeteer-core');
      const chromium = await import('@sparticuz/chromium');
      
      logger.info('Launching browser for PDF generation (local file)...');
      
      const browser = await puppeteer.default.launch({
        args: [
          ...chromium.default.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless
      });

      const page = await browser.newPage();
      
      page.setDefaultNavigationTimeout(60000);
      
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1 
      });
      
      const baseDir = path.join(process.cwd(), 'pdfTempleate');
      logger.info(`Base directory for images: ${baseDir}`);
      
      const htmlWithEmbeddedImages = embedImagesAsBase64(htmlContent, baseDir);
      
      await page.setContent(htmlWithEmbeddedImages, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      //Todo: use the buffer instead of the path to upload
      await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        margin: options.margin || {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        printBackground: options.printBackground !== false,
        path: outputPath
      });

      await browser.close();
      
      logger.info(`PDF generated successfully and saved to: ${outputPath}`);
      return outputPath;
      
    } catch (error) {
      logger.error('Error generating PDF file:', error);
      throw new Error(`Failed to generate PDF file: ${error}`);
    }
}

export async function generatePDFBase64(
    htmlContent: string,
    options: {
      format?: 'A4' | 'Letter' | 'Legal';
      landscape?: boolean;
      margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
      printBackground?: boolean;
    } = {}
  ): Promise<string> {
    try {
      const puppeteer = await import('puppeteer-core');
      const chromium = await import('@sparticuz/chromium');
      
      logger.info('Launching browser for PDF generation (base64)...');
      

      const browser = await puppeteer.default.launch({
        args: [
          ...chromium.default.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless
      });

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000); 
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      });
      
      const baseDir = path.join(process.cwd(), 'pdfTempleate');
      logger.info(`Base directory for images: ${baseDir}`);
      
      const htmlWithEmbeddedImages = embedImagesAsBase64(htmlContent, baseDir);
      
      await page.setContent(htmlWithEmbeddedImages, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        margin: options.margin || {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        printBackground: options.printBackground !== false
      });

      await browser.close();
      const base64 = Buffer.from(pdfBuffer).toString('base64');
      
      logger.info('PDF generated successfully as base64');
      return base64;
      
    } catch (error) {
      logger.error('Error generating PDF as base64:', error);
      throw new Error(`Failed to generate PDF as base64: ${error}`);
    }
}


