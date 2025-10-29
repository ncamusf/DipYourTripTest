import { logger } from "firebase-functions/v2";
import { TripAddOn, TripBrochureData } from "../types/tripData";
import { LLMRequestOptions, LLMResponse } from "../types/llmTypes";
import { AnthropicAPIResponse } from "../types/llmTypes";

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 1.0;

async function callLLM(
  prompt: string,
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const {
    model = DEFAULT_MODEL,
    maxTokens = DEFAULT_MAX_TOKENS,
    temperature = DEFAULT_TEMPERATURE,
    systemPrompt
  } = options;

  try {
    const requestBody: any = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json() as AnthropicAPIResponse;

    return {
      content: data.content[0].text,
      model: data.model,
      usage: {
        input_tokens: data.usage.input_tokens,
        output_tokens: data.usage.output_tokens
      }
    };
  } catch (error) {
    logger.error('Error calling LLM:', error);
    throw error;
  }
}

export async function analyzeTripWithLLM(tripData: TripAddOn[], imagesInfo: string[]): Promise<TripBrochureData> {
  const systemPrompt = 'You are a professional travel brochure designer that creates attractive HTML travel itineraries.';
  
  const prompt = `You need to create a comprehensive travel brochure data structure based on the following trip information.

# INPUT DATA

## Trip Details (Array of activities and add-ons):
${JSON.stringify(tripData, null, 2)}

## Available Images:
${JSON.stringify(imagesInfo, null, 2)}

List of icons to use:
- airplane.png
- desert.png
- lake.png
- trekking.png
- wine.png
- beach.png
- stars.png

# YOUR TASK

Transform the above trip data into a professional travel brochure JSON structure following this exact format:

{
  
  "tripTitle": "Create an engaging title based on the destinations and activities short and concise no more than 4 words",
  "tripSubtitle": "Create a compelling subtitle (optional)",
  
  "trekOptions": [
    {
      "title": "Trek/Trip option name",
      "destinations": ["Array of main destination names from the trip data"],
      "price": "Price if available in data",
      "priceNote": "Note about pricing (e.g., 'per person', 'starting from')"
    }
  ],
  
  "overviewTitle": "Trip Overview",
  "overviewSubtitle": "A brief compelling summary of the trip",
  "timeline": [
    {
      "day": "Day {number}", make sure that the number is the same in all days by start_date to end_date format.
      "iconPath": "{iconName}.png",
      "iconAlt": "Icon description",
      "activity": ["List of activities for this day from trip data"],
      "date": "Date from trip data (start_date to end_date format)",
      "status": "active",
      "title": "Day title summarizing the main activity",
      "descriptions": ["Detailed description paragraphs about what happens this day"]
    }
  ],
  
  "includedTitle": "What's Included",
  "includedItems": [
    {
      "title": "Included item category (e.g., 'Accommodation', 'Transportation', 'Meals')",
      "description": "Description of what's included based on the 'item' and 'detail' fields from trip data"
    }
  ],
  
  "itineraryTitle": "Day by Day Itinerary",
  
  "galleries": [
    {
      "title": "Gallery category (e.g., 'Adventure Activities', 'Landscapes', 'Cultural Experiences')",
      "images": [
        {
          "src": "Just the filename from available images list (e.g., 'image1.jpg'), no path needed - 3 per gallery",//If you dont have enough images, use another topic from the trip data.
          "alt": "Descriptive alt text for the image"
        }
      ]
    }
  ],
  
  "backgroundImages": {
    "cover": "Just the filename from available images (e.g., 'image.jpg'), no path needed",
    "overview": "Just the filename from available images, no path needed",
    "included": "Just the filename from available images, no path needed",
    "itinerary": "Just the filename from available images, no path needed"
    "gallery": "Just the filename from available images, no path needed"
  },
  
  "finalMessage": "Create an inspiring closing message encouraging booking"
  "imagesUsed": ["List of images used from the available images list by the context of the trip"]
}

# IMPORTANT INSTRUCTIONS

1. **Analyze the trip data carefully**: Group activities by day based on the dates, understand the sequence of locations visited
2. **Create engaging content**: Write compelling descriptions that highlight the unique experiences
3. **Use all provided images**: Distribute the available images across cover, galleries, and background sections appropriately
4. **Organize by days**: Use the n_days and date information to create a proper day-by-day itinerary
5. **Extract key information**: Use 'place' for destinations, 'item' for what's included, 'detail' for descriptions
6. **Be creative but accurate**: Enhance the descriptions to be engaging while staying true to the provided data
7. **Icon paths**: Use ONLY the filename (e.g., "airplane.png", "trekking.png", "wine.png", "beach.png", "desert.png", "lake.png", "stars.png") based on the activity type - NO path prefix needed
8. **Image paths**: For all images (backgroundImages and gallery images), use ONLY the filename from the available images list - NO path prefix needed
9. **Return ONLY valid JSON**: Your entire response must be valid JSON that can be parsed directly
10. **day of trip**: ensure that are the same number in all information of the trip.
Output the complete JSON structure now:`
  
  const response = await callLLM(prompt, {
    systemPrompt,
    temperature: 0.7,
    maxTokens: 8000
  });


  let jsonContent = response.content.trim();
  const codeBlockRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
  const match = jsonContent.match(codeBlockRegex);
  
  if (match) {
    jsonContent = match[1].trim();
  }

  try {
    return JSON.parse(jsonContent) as TripBrochureData;
  } catch (error) {
    logger.error('Failed to parse LLM response as JSON:', error);
    logger.error('LLM response content:', response.content);
    throw new Error(`Failed to parse LLM response as JSON: ${error}`);
  }
}

