import { getImageNameFromBucket } from '../../src/externalServices/googleBucket';

describe('Google Bucket Service', () => {
  it('should fetch all image URLs from the bucket', async () => {
    const imageNames = await getImageNameFromBucket();
    expect(imageNames).toBeDefined();
    expect(imageNames).toBeInstanceOf(Array);
    expect(imageNames.length).toBeGreaterThan(0);

    
    const imageNamesFromBucket = imageNames.map(name => name.split('/').pop());
    
    expect(imageNamesFromBucket).toContain('bird-torres-del-paine.jpg');
    expect(imageNamesFromBucket).toContain('people-torres-del-paine.jpg');
    expect(imageNamesFromBucket).toContain('hike-cerro-castillo.jpg');
  }, 30000);
});

