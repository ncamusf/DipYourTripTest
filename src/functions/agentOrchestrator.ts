import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { csvToJsonTrip } from '../utils/utils';
import { TripAddOn } from '../types/tripData';
import { getImageUrlsFromBucket } from '../services/googleBucket';

export const agentOrchestrator = onRequest(
    {
      timeoutSeconds: 120,
      memory: '2GiB'
    },
    async (req, res) => {
      try {
        const { csvData } = req.body;
      
        if (!csvData) {
          res.status(400).json({ error: 'No CSV data provided' });
          return;
        }
        const csvContent = Buffer.from(csvData, 'base64').toString('utf-8');
        const tripAddOns: TripAddOn[] = csvToJsonTrip(csvContent);
        const imagesInfo = await getImageUrlsFromBucket();
        res.status(200).json(imagesInfo);
      } catch (error) {
        logger.error('Error in agentOrchestrator', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );