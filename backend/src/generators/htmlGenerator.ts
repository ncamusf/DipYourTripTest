import { TripBrochureData, TimelineTrip, IncludedItem, GalleryTrip, TrekOption } from '../types/tripData';

function getBackgroundStyle(imageUrl?: string): string {
  if (!imageUrl) {
    return 'background: black;';
  }
  return `background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${imageUrl}') center/cover;`;
}

function generateTimelineItems(items: TimelineTrip[]): string {
  return items.map(item => {
    const activities = item.activity.join('<br>');
    
    return `
            <div class="timeline-item">
                <div class="timeline-icon">
                    <img src="images/icons/${item.iconPath}" alt="${item.iconAlt}">
                </div>
                <div class="timeline-day">${item.day}</div>
                <div class="timeline-activity">${activities}</div>
            </div>`;
  }).join('\n');
}

function generateTimelineContainers(items: TimelineTrip[]): string {
  const maxItemsPerTimeline = 8; 
  const timelineChunks = chunkArray(items, maxItemsPerTimeline);
  
  return timelineChunks.map(chunk => `
        <div class="timeline-container">
            <div class="timeline-line"></div>
${generateTimelineItems(chunk)}
        </div>`).join('\n');
}

function generateIncludedItems(items: IncludedItem[]): string {
  return items.map(item => 
    `<div class="included-item"><strong>${item.title}</strong> ${item.description}</div>`
  ).join('\n            ');
}

function generateDayCards(days: TimelineTrip[]): string {
  return days.map(day => {
    const descriptions = day.descriptions
      .map(desc => `<p>${desc}</p>`)
      .join('\n                ');
    
    return `
            <div class="day-card">
                <h3>${day.day} - ${day.title}</h3>
                ${descriptions}
            </div>`;
  }).join('\n');
}

function generateTrekOptions(options: TrekOption[]): string {
  return options.map(option => {
    const destinations = option.destinations
      .map(dest => `<li>${dest}</li>`)
      .join('\n                    ');
    
    const priceDisplay = option.price || 'Price Not Available';
    const priceNote = option.priceNote || '* Contact us for details';
    
    return `
            <div class="trek-card">
                <h2>${option.title}</h2>
                <ul>
                    ${destinations}
                </ul>
                <div class="price-box">
                    <div class="price">${priceDisplay}</div>
                    <div class="price-note">${priceNote}</div>
                </div>
            </div>`;
  }).join('\n');
}

function generateGallerySlide(gallery: GalleryTrip, index: number): string {
  const images = gallery.images
    .map(img => `
            <div class="photo-item">
                <img src="images/tempPhotos/${img.src}" alt="${img.alt}">
            </div>`)
    .join('\n');

  return `
    <!-- SLIDE ${index}: Gallery - ${gallery.title} -->
    <div class="slide slide-gallery">
        <div class="logo">
            <img src="images/logo/dipLogo.png" alt="Dip Your Trip Logo">
        </div>
        <h3 class="gallery-title">${gallery.title}</h3>
        <div class="photo-grid">
${images}
        </div>
    </div>`;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function generateHTML(data: TripBrochureData): string {

  const dayChunks = chunkArray(data.timeline, 4);
  const daySlides = dayChunks.map((chunk, index) => `
    <!-- SLIDE ${4 + index}: Day by Day ${index * 4 + 1}-${Math.min((index + 1) * 4, data.timeline.length)} -->
    <div class="slide slide-itinerary">
        <div class="logo">
            <img src="images/logo/dipLogo.png" alt="Dip Your Trip Logo">
        </div>
        <h2 class="slide-title">${data.itineraryTitle}</h2>
        <div class="days-grid">
${generateDayCards(chunk)}
        </div>
    </div>`).join('\n');

  const gallerySlides = data.galleries.map((gallery, index) => 
    generateGallerySlide(gallery, 7 + index)
  ).join('\n');

    // Build complete HTML
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dip Your Trip - ${data.tripTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            overflow-x: hidden;
            background: black;
        }

        /* Slide Container */
        .slide {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            page-break-after: always;
            page-break-inside: avoid;
            overflow: hidden;
        }

        /* Print Styles for PDF */
        @media print {
            .slide {
                width: 100%;
                height: 100vh;
                page-break-after: always;
                page-break-inside: avoid;
            }

            body {
                margin: 0;
                padding: 0;
            }
        }

        @page {
            size: landscape;
            margin: 0;
        }

        /* Logo Styles */
        .logo {
            position: absolute;
            top: 40px;
            right: 40px;
            z-index: 10;
        }

        .logo img {
            height: 180px;
            width: auto;
            filter: brightness(0) invert(1);
        }

        .logo-large {
            position: static !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-size: 3rem;
            font-weight: 400;
            letter-spacing: 0.8rem;
            font-family: 'Segoe UI', 'Arial', sans-serif;
        }

        .logo-large img {
            height: 100px !important;
        }

        /* Slide 1 - Cover */
        .slide-cover {
            ${getBackgroundStyle(data.backgroundImages.cover ? `images/tempPhotos/${data.backgroundImages.cover}` : undefined)}
        }

        .slide-cover .logo-large {
            margin-bottom: 2rem;
        }

        .slide-cover h1 {
            font-size: 5rem;
            font-weight: 700;
            text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.8);
            margin-bottom: 3rem;
        }

        .trek-options-container {
            display: flex;
            gap: 3rem;
            margin-top: 2rem;
        }

        .trek-card {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            padding: 2.5rem;
            border-radius: 15px;
            min-width: 400px;
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .trek-card h2 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
            border-bottom: 2px solid white;
            padding-bottom: 1rem;
        }

        .trek-card ul {
            list-style: none;
            margin: 1.5rem 0;
        }

        .trek-card li {
            padding: 0.7rem 0;
            padding-left: 2rem;
            position: relative;
            font-size: 1.1rem;
        }

        .trek-card li::before {
            content: '→';
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #4CAF50;
        }

        .price-box {
            border: 3px dashed white;
            padding: 1.5rem;
            text-align: center;
            margin-top: 1.5rem;
        }

        .price {
            font-size: 2.2rem;
            font-weight: bold;
        }

        .price-note {
            font-size: 0.85rem;
            margin-top: 0.5rem;
            opacity: 0.9;
        }

        /* Slide 2 - Trip Overview with Timeline */
        .slide-overview {
            ${getBackgroundStyle(`images/tempPhotos/${data.backgroundImages.overview}`)}
            padding: 80px 60px;
        }

        .overview-title {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .overview-subtitle {
            font-size: 1.3rem;
            margin-top: 1.5rem;
            margin-bottom: 3rem;
            text-align: center;
            opacity: 0.95;
            padding: 0 10%;
        }

        .timeline-container {
            display: flex;
            justify-content: space-evenly;
            align-items: flex-start;
            position: relative;
            margin: 1.5rem auto 1.5rem;
            max-width: 98%;
            padding: 25px 10px 15px 10px;
            gap: 0.3rem;
        }

        .timeline-container:first-of-type {
            margin-top: 3rem;
        }

        .timeline-line {
            position: absolute;
            top: 65px;
            left: 2%;
            right: 2%;
            height: 6px;
            background: white;
            z-index: 1;
        }

        .timeline-item {
            flex: 1 1 0;
            text-align: center;
            position: relative;
            z-index: 2;
            max-width: 160px;
            min-width: 90px;
            padding: 0 0.2rem;
            overflow: visible;
        }

        .timeline-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            position: absolute;
            top: 65px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;
        }

        .timeline-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }

        .timeline-day {
            font-size: 0.95rem;
            font-weight: bold;
            margin-bottom: 0.3rem;
            text-align: center;
            margin-top: 90px;
            white-space: nowrap;
        }

        .timeline-activity {
            font-size: 0.8rem;
            opacity: 0.95;
            line-height: 1.2;
            text-align: center;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }

        .timeline-date {
            font-size: 0.85rem;
            font-weight: 500;
            opacity: 0.8;
            text-align: center;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            width: max-content;
            line-height: 1.2;
            padding: 0;
            margin: 0;
            height: auto;
        }

        /* Slide 3 - What's Included */
        .slide-included {
            ${getBackgroundStyle(data.backgroundImages.included ? `images/tempPhotos/${data.backgroundImages.included}` : undefined)}
            padding: 80px 100px;
            justify-content: flex-start;
        }

        .slide-title {
            font-size: 3.5rem;
            margin-bottom: 3rem;
            align-self: flex-start;
        }

        .included-container {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            width: 100%;
        }

        .included-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.2rem 3rem;
            width: 100%;
        }

        .included-item {
            font-size: 1.2rem;
            padding: 0.5rem 0;
            position: relative;
            padding-left: 1.8rem;
        }

        .included-item::before {
            content: '•';
            position: absolute;
            left: 0;
            top: 0.3rem;
            font-size: 1.8rem;
            font-weight: bold;
            color: #4CAF50;
            line-height: 1;
        }

        .included-item strong {
            font-weight: 700;
            color: #fff;
        }

        /* Slide 4 & 5 - Day by Day */
        .slide-itinerary {
            ${getBackgroundStyle(data.backgroundImages.itinerary ? `images/tempPhotos/${data.backgroundImages.itinerary}` : undefined)}
            padding: 80px 80px;
            justify-content: flex-start;
        }

        .days-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            width: 100%;
        }

        .day-card {
            background: rgba(0, 0, 0, 0.6);
            padding: 1.5rem;
            border-radius: 10px;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .day-card h3 {
            font-size: 1.4rem;
            margin-bottom: 0.8rem;
            color: #ffffff;
            border-bottom: 2px solid #ffffff;
            padding-bottom: 0.5rem;
        }

        .day-card p {
            line-height: 1.6;
            opacity: 0.95;
            text-align: justify;
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
        }

        /* Gallery Slides */
        .slide-gallery {
            ${getBackgroundStyle(data.backgroundImages.gallery ? `images/tempPhotos/${data.backgroundImages.gallery}` : undefined)}
            padding: 80px 60px;
        }

        .gallery-title {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-align: center;
        }

        .photo-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            width: 90%;
        }

        .photo-item {
            aspect-ratio: 4/3;
            overflow: hidden;
            border-radius: 10px;
            border: 3px solid white;
        }

        .photo-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
        }

        /* Optimize background images for print */
        @media print {
            .slide {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        
        /* Slide - Full Itinerary */
        .slide-full-itinerary {
            ${getBackgroundStyle(data.backgroundImages.itinerary ? `images/tempPhotos/${data.backgroundImages.itinerary}` : undefined)}
            padding: 80px 80px;
        }

        /* Final Slide */
        .slide-final {
            ${getBackgroundStyle(data.backgroundImages.cover ? `images/tempPhotos/${data.backgroundImages.cover}` : undefined)}
        }

        .slide-final .logo-large {
            margin-bottom: 2rem;
        }

        .final-content {
            text-align: center;
        }

        .final-content h2 {
            font-size: 4rem;
            margin-bottom: 1.5rem;
        }

        .final-content h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .final-trek-list {
            list-style: none;
            font-size: 1.5rem;
            margin: 2rem 0;
        }

        .final-trek-list li {
            margin: 0.7rem 0;
            padding-left: 2rem;
            position: relative;
        }

        .final-trek-list li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #4CAF50;
        }

        .final-price {
            font-size: 3.5rem;
            font-weight: bold;
            margin-top: 2rem;
            color: #4CAF50;
        }
    </style>
</head>

<body>

    <!-- SLIDE 1: Cover -->
    <div class="slide slide-cover">
        <div class="logo logo-large">
            <img src="images/logo/dipLogo.png" alt="Dip Your Trip Logo">
            <span>DIP YOUR TRIP</span>
        </div>
        <h1>${data.tripTitle}</h1>
        <div class="trek-options-container">
${generateTrekOptions(data.trekOptions)}
        </div>
    </div>

    <!-- SLIDE 2: Trip Overview - Timeline -->
    <div class="slide slide-overview">
        <div class="logo">
            <img src="images/logo/dipLogo.png" alt="Dip Your Trip Logo">
        </div>
        <h2 class="overview-title">${data.overviewTitle}</h2>
        <p class="overview-subtitle">${data.overviewSubtitle}</p>

${generateTimelineContainers(data.timeline)}
    </div>

    <!-- SLIDE 3: What's Included -->
    <div class="slide slide-included">
        <div class="logo">
            <img src="images/logo/dipLogo.png" alt="Dip Your Trip Logo">
        </div>
        <h2 class="slide-title">${data.includedTitle}</h2>
        <div class="included-container">
            <div class="included-grid">
                ${generateIncludedItems(data.includedItems)}
            </div>
        </div>
    </div>

${daySlides}
${gallerySlides}

    <!-- SLIDE FINAL: Call to Action -->
    <div class="slide slide-final">
        <div class="logo logo-large">
            <img src="images/logo/dipLogo.png" alt="Dip Your Trip Logo">
            <span>DIP YOUR TRIP</span>
        </div>
        <h1>${data.tripTitle}</h1>
        <div class="trek-options-container">
${generateTrekOptions(data.trekOptions)}
        </div>
    </div>

</body>

</html>`;
}

