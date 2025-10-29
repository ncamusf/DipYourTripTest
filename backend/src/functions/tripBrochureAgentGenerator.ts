import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import * as path from 'path';
import { cleanupDirectory, validateAndParseCsvData } from '../utils/utils';
import { TripAddOn, TripBrochureData } from '../types/tripData';
import { downloadAndOptimizeImages, getImageNameFromBucket, getImageUrlsFromBucket } from '../externalServices/googleBucket';
import { analyzeTripWithLLM } from '../externalServices/llmService';
import { generateBrochureFile } from '../generators/pdfService';
import { uploadPdf } from '../externalServices/pdfUploadService';


async function processTripData(tripAddOns: TripAddOn[]): Promise<TripBrochureData> {
  const imagesInfo = await getImageNameFromBucket();
  logger.info(`Found ${imagesInfo.length} images in bucket`);
  
  const tripBrochureData = await analyzeTripWithLLM(tripAddOns, imagesInfo);
  logger.info(`LLM selected ${tripBrochureData.imagesUsed.length} images: ${tripBrochureData.imagesUsed.join(', ')}`);
  
  const imagesUrls = await getImageUrlsFromBucket(tripBrochureData.imagesUsed);
  logger.info(`Downloading ${imagesUrls.length} images.`);
  
  const downloadResults = await downloadAndOptimizeImages(imagesUrls, {
    outputDir: path.join(process.cwd(), 'pdfTempleate', 'images', 'tempPhotos')
  });
  
  logger.info(`Successfully downloaded ${downloadResults.length} images`);
  
  return tripBrochureData;
}

async function generateBrochure(csvData: string | undefined): Promise<string> {

  const tripAddOns = validateAndParseCsvData(csvData);
  const tripBrochureData = await processTripData(tripAddOns)
  const pdfPath = await generateBrochureFile(tripBrochureData);
  return pdfPath;
}

async function tripBrochureGeneratorProcess(csvData: string | undefined): Promise<string> {
  const pdfPath = await generateBrochure(csvData);
  const pdfUrl = await uploadPdf(pdfPath);
  
  logger.info(`PDF brochure saved to: ${pdfPath}`);
  
  await cleanupDirectory('pdfTempleate/images/tempPhotos', 'tempPhotos');
  await cleanupDirectory('pdfs');
  
  return pdfUrl;
}

export const tripBrochureAgentGenerator = onRequest(
  {
    timeoutSeconds: 540,
    memory: '2GiB'
  },
  async (req, res) => {
    try {
      const { csvData } = req.body;
      const pdfUrl = await tripBrochureGeneratorProcess(csvData);
      
      res.status(200).json({ 
        url: pdfUrl,
        message: 'PDF brochure generated successfully'
      });
    } catch (error) {
      logger.error("Error in agentOrchestrator", error);
      
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      const statusCode = errorMessage === 'No CSV data provided' ? 400 : 500;
      
      res.status(statusCode).json({ error: errorMessage });
    }
  }
);