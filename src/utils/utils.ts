import { logger } from "firebase-functions/v2";
import { TripAddOn } from "../types/tripData";

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