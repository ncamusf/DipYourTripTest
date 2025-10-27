import { getImageUrlsFromBucket } from '../../src/services/googleBucket';

describe('Google Bucket Service', () => {
  it('should fetch all image URLs from the bucket', async () => {
    const imageUrls = await getImageUrlsFromBucket();
    expect(imageUrls).toBeDefined();
    expect(imageUrls).toBeInstanceOf(Array);
    expect(imageUrls.length).toBeGreaterThan(0);
    
    const imageNames = imageUrls.map(url => url.split('/').pop());
    expect(imageNames).toContain('bird-torres-del-paine.jpg');
    expect(imageNames).toContain('people-torres-del-paine.jpg');
    expect(imageNames).toContain('hike-cerro-castillo.jpg');
  }, 30000);
});

