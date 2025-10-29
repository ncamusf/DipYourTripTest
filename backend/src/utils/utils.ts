import { logger } from "firebase-functions/v2";
import { TripAddOn } from "../types/tripData";
import * as fs from 'fs/promises';
import * as path from 'path';

export function validateAndParseCsvData(csvData: string | undefined): TripAddOn[] {
  if (!csvData) {
    throw new Error('No CSV data provided');
  }
  
  const csvContent = Buffer.from(csvData, 'base64').toString('utf-8');
  return csvToJsonTrip(csvContent);
}

export const csvToJsonTrip = (csvData: string): TripAddOn[] => {
      try {
      const lines = csvData.split('\n').filter(line => line.trim());
      const headers = lines[0].split(','); 
      
      const jsonData = lines.slice(1).map(line => {
        const values = line.split(',');
        const row: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          if (header === 'n_days' || header === 'n_users') {
            row[header] = parseFloat(value) || 0;
          } else {
            row[header] = value;
          }
        });
        
        return row as TripAddOn;
      });
      return jsonData;
    }
      catch (error) {
        logger.error('Error converting CSV to JSON:', error);
        throw new Error('Error converting CSV to JSON');
      }
    };

export async function cleanupDirectory(dirPath: string, dirName?: string): Promise<void> {
  const fullPath = path.isAbsolute(dirPath) 
    ? dirPath 
    : path.join(process.cwd(), dirPath);
  
  const logName = dirName || path.basename(fullPath);
  
  try {
    await fs.rm(fullPath, { recursive: true, force: true });
    logger.info(`Cleaned up and removed ${logName} directory: ${fullPath}`);
  } catch (error) {
    logger.warn(`Error cleaning up ${logName} directory:`, error);
  }
}