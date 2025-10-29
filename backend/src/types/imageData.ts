export interface BucketImage {
    name: string;
    url: string;
    size: number;
    lastModified: string;
    etag: string;
  }

export interface OptimizeOptions {
  quality?: number;        
  maxWidth?: number;       
  maxHeight?: number;      
  format?: 'jpeg' | 'webp' | 'png';  
  outputDir?: string;      
}