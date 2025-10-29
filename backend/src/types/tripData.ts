export interface TripAddOn {
  trip_id: string;
  add_on_id: string;
  start_date: string;
  end_date: string;
  n_days: number;
  n_users: number;
  place: string;
  item: string;
  detail: string;
}

export interface TrekOption {
  title: string;
  destinations: string[];
  price?: string;
  priceNote?: string;
}

export interface TimelineTrip {
  day: string;
  iconPath: string;
  iconAlt: string;
  activity: string[];
  date: string;
  title: string;
  descriptions: string[];
}

export interface IncludedItem {
  title: string;
  description: string;
}

export interface GalleryTrip {
  title: string;
  images: {
    src: string;
    alt: string;
  }[];
}

export interface BackgroundImagesTrip {
  cover?: string;
  overview?: string;
  included?: string;
  itinerary?: string;
  gallery?: string;
}

export interface TripBrochureData {
  
  // Trip Basic Info
  tripTitle: string;
  tripSubtitle?: string;
  
  // Cover Page
  trekOptions: TrekOption[];
  
  // Timeline Overview
  overviewTitle: string;
  overviewSubtitle: string;
  timeline: TimelineTrip[];
  
  // What's Included
  includedTitle: string;
  includedItems: IncludedItem[];
  
  // Day by Day Itinerary
  itineraryTitle: string;
  days: TimelineTrip[];
  
  // Gallery
  galleries: GalleryTrip[];
  
  // Background Images
  backgroundImages: BackgroundImagesTrip;
  
  // Final Call to Action
  finalMessage?: string;

  imagesUsed: string[];
}