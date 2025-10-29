import { csvToJsonTrip } from '../../src/utils/utils';
import { TripAddOn } from '../../src/types/tripData';
import * as fs from 'fs';
import * as path from 'path';

describe('csvToJson', () => {
  it('should convert trip1.csv to JSON array', () => {
    
    const csvFilePath = path.join(__dirname, 'trip1.csv');
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    const result: TripAddOn[] = csvToJsonTrip(csvContent);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    expect(result).toEqual([
      {
        "add_on_id": "",
        "detail": "Seguro normal por 15 días",
        "end_date": "2025-01-18",
        "item": "Seguro",
        "n_days": 13,
        "n_users": 16,
        "place": "Santiago",
        "start_date": "2025-01-05",
        "trip_id": "W_Berkeley_25",
      },
      {
        "add_on_id": "",
        "detail": "Onteaiken Aeropuerto-PNT",
        "end_date": "2025-01-05",
        "item": "Transporte",
        "n_days": 1,
        "n_users": 16,
        "place": "Puerto Natales",
        "start_date": "2025-01-05",
        "trip_id": "W_Berkeley_25",
      }
    ]);
  });
});


