import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import sharp from 'sharp';
import { logger } from 'firebase-functions/v2';
import { BucketImage, OptimizeOptions } from '../types/imageData';

const BUCKET_URL = 'https://storage.googleapis.com/dyt-challenge-images/';


async function getImagesFromBucket(): Promise<BucketImage[]> {
  try {
    const response = await fetch(BUCKET_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bucket: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    const images = parseImagesFromXML(xmlText);
    
    return images;
  } catch (error) {
    logger.error('Error fetching images from bucket:', error);
    throw error;
  }
}

function parseImagesFromXML(xmlText: string): BucketImage[] {
    const images: BucketImage[] = [];
    
    const keyRegex = /<Key>(.*?)<\/Key>/g;
    const sizeRegex = /<Size>(.*?)<\/Size>/g;
    const lastModifiedRegex = /<LastModified>(.*?)<\/LastModified>/g;
    const etagRegex = /<ETag>(.*?)<\/ETag>/g;
    
    const keys = Array.from(xmlText.matchAll(keyRegex), m => m[1]);
    const sizes = Array.from(xmlText.matchAll(sizeRegex), m => parseInt(m[1], 10));
    const lastModifiedDates = Array.from(xmlText.matchAll(lastModifiedRegex), m => m[1]);
    const etags = Array.from(xmlText.matchAll(etagRegex), m => m[1].replace(/"/g, ''));
    
    keys.forEach((key, index) => {
      images.push({
        name: key,
        url: `${BUCKET_URL}${key}`,
        size: sizes[index] || 0,
        lastModified: lastModifiedDates[index] || '',
        etag: etags[index] || ''
      });
    });
    
    return images;
  }

export async function getImageUrlsFromBucket(imagesNames: string[]): Promise<string[]> {
  const images = await getImagesFromBucket();
  return images.filter((img: BucketImage) => imagesNames.includes(img.name)).map((img: BucketImage) => img.url);
}

export async function getImageNameFromBucket(): Promise<string[]> {
  const images = await getImagesFromBucket();
  return images.map((img: BucketImage) => img.name);
}

function downloadImage(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizeOptions
): Promise<{ originalSize: number; optimizedSize: number }> {
  const originalSize = fs.statSync(inputPath).size;
  
  let pipeline = sharp(inputPath);
  
  if (options.maxWidth || options.maxHeight) {
    pipeline = pipeline.resize(options.maxWidth, options.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  switch (options.format) {
    case 'webp':
      pipeline = pipeline.webp({ quality: options.quality || 80 });
      break;
    case 'png':
      pipeline = pipeline.png({ quality: options.quality || 80, compressionLevel: 9 });
      break;
    case 'jpeg':
    default:
      pipeline = pipeline.jpeg({ quality: options.quality || 80, progressive: true });
      break;
  }
  
  await pipeline.toFile(outputPath);
  
  const optimizedSize = fs.statSync(outputPath).size;
  
  return { originalSize, optimizedSize };
}

export async function downloadAndOptimizeImages(
  imageUrls: string[],
  options: OptimizeOptions = {}
): Promise<Array<{
  url: string;
  filename: string;
  originalSize: number;
  optimizedSize: number;
  savings: string;
}>> {

  const opts: Required<OptimizeOptions> = {
    quality: options.quality || 70,
    maxWidth: options.maxWidth || 1200,
    maxHeight: options.maxHeight || 675,
    format: options.format || 'jpeg',
    outputDir: options.outputDir || path.join(process.cwd(), 'pdfTempleate', 'images'),
  };

  if (!fs.existsSync(opts.outputDir)) {
    fs.mkdirSync(opts.outputDir, { recursive: true });
  }
  

  const tempDir = path.join(opts.outputDir, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const results = await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const urlPath = new URL(url).pathname;
        const originalFilename = path.basename(urlPath);
        const nameWithoutExt = path.parse(originalFilename).name;
        const originalExt = path.parse(originalFilename).ext.toLowerCase().slice(1);
        
        const imageFormat = options.format || (originalExt === 'jpg' || originalExt === 'jpeg' ? 'jpeg' : 
                                                originalExt === 'webp' ? 'webp' : 
                                                originalExt === 'png' ? 'png' : 'jpeg') as 'jpeg' | 'webp' | 'png';
        
        const extension = imageFormat === 'jpeg' ? originalExt : imageFormat;
        
        const tempPath = path.join(tempDir, originalFilename);
        await downloadImage(url, tempPath);
        
        const outputFilename = `${nameWithoutExt}.${extension}`;
        const outputPath = path.join(opts.outputDir, outputFilename);
        const optimizeOpts = { ...opts, format: imageFormat };
        const { originalSize, optimizedSize } = await optimizeImage(tempPath, outputPath, optimizeOpts);
        
        const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
        try {
          await fs.promises.unlink(tempPath);
        } catch (unlinkError) {
          logger.warn(`Could not delete temp file ${tempPath}, will be cleaned up later`);
        }
        
        return {
          url,
          filename: outputFilename,
          originalSize,
          optimizedSize,
          savings: `${savings}%`
        };
      } catch (error) {
        logger.error(`Failed to process ${url}:`, error);
        return null;
      }
    })
  );
  
  const successfulResults = results.filter((result): result is NonNullable<typeof result> => result !== null);

  return successfulResults;
}

export function extractImageUrlsFromHTML(htmlPath: string): string[] {
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const urlRegex = /https:\/\/storage\.googleapis\.com\/dyt-challenge-images\/[^"')]+/g;
  const urls = htmlContent.match(urlRegex) || [];
  return [...new Set(urls)]; // Remove duplicates
}
