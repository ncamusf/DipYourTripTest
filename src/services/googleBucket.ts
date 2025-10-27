/**
 * Service for fetching images from Google Cloud Storage bucket
 */

const BUCKET_URL = 'https://storage.googleapis.com/dyt-challenge-images/';

interface BucketImage {
  name: string;
  url: string;
  size: number;
  lastModified: string;
  etag: string;
}
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
    console.error('Error fetching images from bucket:', error);
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

export async function getImageUrlsFromBucket(): Promise<string[]> {
  const images = await getImagesFromBucket();
  return images.map((img: BucketImage) => img.url);
}


