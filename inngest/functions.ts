import { inngest } from "./client";
import OpenAI from 'openai';
import Replicate from 'replicate';
import moment from 'moment';
import ImageKit from 'imagekit';
import { db } from "@/configs/db";
import { AiThumbnailTable, AiContentTable } from "@/configs/schema";
import axios from "axios";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

const imageKit = new ImageKit({
  publicKey: process.env.ImageKit_PUBLIC_KEY!,
  privateKey: process.env.ImageKit_PRIVATE_KEY!,
  urlEndpoint: process.env.ImageKit_URL_ENDPOINT!,
});


export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
});


export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY
});


export const generateAiThumbnail = inngest.createFunction(
  { id: "ai/generate-thumbnail" },
  { event: "ai/generate-thumbnail " },
  async ({ event, step }) => {
    const { userEmail, userInput, refImage, faceImage } = await event.data;
    // now need to upload images to cloud/imagekit or s3
    // await step.sleep("wait-a-moment", "5s");
    // return 'Success';
    const uploadImageUrls = await step.run(
      "UploadImage",
      async () => {
        if (refImage) {
          const refImageUrl = await imageKit.upload({
            file: refImage?.buffer ?? '',
            fileName: refImage.name,
            isPublished: true,
            useUniqueFileName: true
          })
          // const faceImageUrl=await imageKit.upload({
          //   file:faceImage?.buffer??'',
          //   fileName:faceImage.name,
          //   isPublished:true,
          //   useUniqueFileName:true
          // })
          return refImageUrl.url;
        } else {
          return null;
        }
      }
    )

    //generate thumbnail using ai service
    const generateThumbnailPrompt = await step.run('GenerateThumbnailPrompt', async () => {
      const messageContent: any[] = [
        {
          "type": "text",
          "text": uploadImageUrls
            ? `Refering to this thumbnail url write a text prompt to generate youtube thumbnail similar to the attached reference image with the following user input: ${userInput}. Only give me text prompt, No other comment text`
            : `Depends on user input write a text prompt to generate high quality professional youtube thumbnail prompt, Make sure to Add relavent icons, illustrations or images as per title. UserInput: ${userInput}. Only give me text prompt, No other comment text`
        }
      ];

      // Only add image_url if we have a valid URL
      if (uploadImageUrls) {
        messageContent.push({
          "type": "image_url",
          "image_url": {
            "url": uploadImageUrls
          }
        });
      }

      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash',
        max_tokens: 350,
        messages: [
          {
            role: 'user',
            content: messageContent,
          },
        ],
      });

      console.log(completion.choices[0].message.content);
      return completion.choices[0].message.content;

    })


    // generate image
    const generateThumbnailImage = await step.run('Generate Image', async () => {
      const input = {
        prompt: generateThumbnailPrompt,
        aspect_ratio: "16:9",
        output_format: "png",
        safety_filter_level: "block_only_high"
      };
      const output = await replicate.run("google/imagen-4-fast", { input });

      //@ts-ignore
      return output.url();
    })


    // save image to cloud storage
    const uploadThumbnail = await step.run('Upload Thumbnail', async () => {
      const imageRef = await imageKit.upload({
        file: generateThumbnailImage,
        fileName: Date.now() + '.png',
        isPublished: true,
        useUniqueFileName: false
      })
      return imageRef.url;
    })


    // save all records to database
    const SaveToDB = await step.run('SaveToDB', async () => {
      const result = await db.insert(AiThumbnailTable).values({
        userInput: userInput,
        thumbnailUrl: uploadThumbnail,
        // for this a npm moment library is used
        createdOn: moment().format('yyyy-MM-DD'),
        refImage: uploadImageUrls,
        userEmail: userEmail
      }).returning()
      return result;
    })

    return uploadThumbnail;
  }

)


const AIContentGeneratorSystemPrompt = `You are an expert youtube SEO specialist and AI creative assistant. Based on the user input below, generate a JSON response only(no explanation, no markdown, no other text) with the following structure:
1. Three youtube video titles optimized for SEO 
2. SEO score for each title (1-100) 
3. A compelling video description based on the selected topic 
4. 10 youtube tags relevant to the topic and with high search volume
5. Two different thumbnail prompts to generate professional youtube thumbnails- use different styles or concepts based on the video topic.
User Input: {{userInput}}
Return format: (JSON only, no other text)
{  
"titles": [
    {
      "title": "Generated Title 1",
      "seoScore": 80
    },
    {
      "title": "Generated Title 2",
      "seoScore": 75
    },
    {
      "title": "Generated Title 3",
      "seoScore": 90
    }
],
"description": "Generated compelling video description here based on the user input.",
"tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
"thumbnailPrompts": [
  {
    "heading": "Thumbnail Prompt 1",
    "prompt": "A professional YouTube thumbnail based on title 1, with a 3D style, featuring a character in action against a vibrant background with bold text overlay."
  },
  {
    "heading": "Thumbnail Prompt 2",
    "prompt": "A flat vector-style YouTube thumbnail based on title 2, showing an object or concept relevant to the video topic, with clean lines and contrasting colors."
  }
]
}
IMPORTANT: Return ONLY valid JSON. No trailing commas after the last element in arrays or objects. No comments. No markdown. No explanation before or after the JSON.
Make sure the response includes the real content based on the user input and follow this structure exactly also reflects the respective title context, includes visual style (3D/flat/vector), character/action/objects (if needed), background design and text position ideas`

export const generateAIContent = inngest.createFunction(
  { id: "ai/generate-content" },
  { event: "ai/generate-content" },
  async ({ event, step }) => {
    const { userEmail, userInput } = event.data;
    console.log('Starting Inngest workflow for:', { userEmail, userInput });

    // Step 1: Generate content using AI
    const generateContent = await step.run('GenerateContent', async () => {
      try {
        console.log('Step 1: Generating content with AI...');
        const completion = await openai.chat.completions.create({
          model: 'google/gemini-2.5-flash',
          max_tokens: 1500,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: AIContentGeneratorSystemPrompt.replace('{{userInput}}', userInput),
            },
          ],
        });

        const rawJson = completion.choices[0]?.message?.content;
        console.log('AI content generated successfully');

        if (!rawJson) {
          throw new Error('No content received from AI');
        }

        // Clean up the JSON response
        let cleanedJson = rawJson.trim();
        cleanedJson = cleanedJson.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

        const jsonStart = cleanedJson.indexOf('{');
        const jsonEnd = cleanedJson.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('No valid JSON found in AI response');
        }

        cleanedJson = cleanedJson.substring(jsonStart, jsonEnd + 1);

        // Remove trailing commas before } or ] (common LLM JSON issue)
        cleanedJson = cleanedJson.replace(/,\s*([\]}])/g, '$1');
        // Remove any control characters that might break parsing
        cleanedJson = cleanedJson.replace(/[\x00-\x1F\x7F]/g, (ch) => ch === '\n' || ch === '\r' || ch === '\t' ? ch : '');

        const parsedJson = JSON.parse(cleanedJson);

        // Validate required fields
        if (!parsedJson.titles || !parsedJson.description || !parsedJson.tags || !parsedJson.thumbnailPrompts) {
          throw new Error('Invalid JSON structure received from AI');
        }

        return parsedJson;
      } catch (error) {
        console.error('Error in Step 1 - Generate Content:', error);
        throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Step 2: Generate thumbnail images for each prompt
    const generateThumbnailImages = await step.run('GenerateThumbnailImages', async () => {
      try {
        console.log('Step 2: Generating thumbnail images...');
        const thumbnailUrls = [];

        // Helper: run a Replicate request with retry on 429 rate limit
        const runWithRetry = async (input: any, maxRetries = 4): Promise<string> => {
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              const output = await replicate.run("google/imagen-4-fast", { input });
              //@ts-ignore
              return output.url();
            } catch (err: any) {
              const is429 = err?.message?.includes('429') || err?.status === 429;
              if (is429 && attempt < maxRetries) {
                // Parse retry_after from error or default to 10s
                const waitSec = parseInt(err?.message?.match(/retry_after.*?(\d+)/)?.[1]) || 10;
                console.log(`Rate limited (429). Waiting ${waitSec}s before retry ${attempt + 1}/${maxRetries}...`);
                await new Promise(r => setTimeout(r, waitSec * 1000));
              } else {
                throw err;
              }
            }
          }
          throw new Error('Max retries exceeded for Replicate API');
        };

        // Generate images for each thumbnail prompt with delay between requests
        for (let i = 0; i < generateContent.thumbnailPrompts.length; i++) {
          const prompt = generateContent.thumbnailPrompts[i].prompt;
          console.log(`Generating thumbnail ${i + 1}/${generateContent.thumbnailPrompts.length}`);

          // Wait 12s between requests to stay under rate limit (6 req/min = 1 per 10s)
          if (i > 0) {
            console.log('Waiting 12s between requests to avoid rate limiting...');
            await new Promise(r => setTimeout(r, 12000));
          }

          const input = {
            prompt: prompt,
            aspect_ratio: "16:9",
            output_format: "png",
            safety_filter_level: "block_only_high"
          };

          const imageUrl = await runWithRetry(input);
          thumbnailUrls.push(imageUrl);

          console.log(`Thumbnail ${i + 1} generated: ${imageUrl}`);
        }

        return thumbnailUrls;
      } catch (error) {
        console.error('Error in Step 2 - Generate Thumbnail Images:', error);
        throw new Error(`Thumbnail generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Step 3: Upload thumbnails to cloud storage
    const uploadThumbnails = await step.run('UploadThumbnails', async () => {
      try {
        console.log('Step 3: Uploading thumbnails to cloud storage...');
        const uploadedThumbnails = [];

        for (let i = 0; i < generateThumbnailImages.length; i++) {
          const imageUrl = generateThumbnailImages[i];
          console.log(`Uploading thumbnail ${i + 1}/${generateThumbnailImages.length}`);

          const uploadResult = await imageKit.upload({
            file: imageUrl,
            fileName: `thumbnail_${userInput.replace(/\s+/g, '_')}_${Date.now()}_${i + 1}.png`,
            isPublished: true,
            useUniqueFileName: true
          });

          uploadedThumbnails.push({
            prompt: generateContent.thumbnailPrompts[i]?.prompt || String(generateContent.thumbnailPrompts[i]),
            originalUrl: imageUrl,
            uploadedUrl: uploadResult.url,
            thumbnailId: uploadResult.fileId
          });

          console.log(`Thumbnail ${i + 1} uploaded: ${uploadResult.url}`);
        }

        return uploadedThumbnails;
      } catch (error) {
        console.error('Error in Step 3 - Upload Thumbnails:', error);
        throw new Error(`Thumbnail upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Step 4: Save all content to database
    const saveContentToDB = await step.run('SaveContentToDB', async () => {
      try {
        console.log('Step 4: Saving content to database...');

        const result = await db.insert(AiContentTable).values({
          content: generateContent as any,
          createdOn: moment().format('yyyy-MM-DD'),
          thumbnailUrl: String(uploadThumbnails[0]?.uploadedUrl || ''),
          userEmail: String(userEmail),
          userInput: String(userInput)
        }).returning();

        console.log('Content saved to database successfully');
        return result;
      } catch (error) {
        console.error('Error in Step 4 - Save to DB:', error);
        throw new Error(`Database save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Return complete workflow results
    const workflowResult = {
      content: generateContent,
      thumbnails: uploadThumbnails,
      database: saveContentToDB
    };

    console.log('Complete 4-step Inngest workflow finished successfully');
    return workflowResult;
  }
)

export const getTrendingKeywords = inngest.createFunction(
  { id: 'ai/get-trending-keywords' },
  { event: 'ai/get-trending-keywords' },
  async ({ event, step }) => {
    const { userEmail, userInput } = await event.data;

    //Step 1 get Google Search result with help of Bright data
    const googleSearchResult = await step.run('getGoogleSearchResult', async () => {
      try {
        const res = await axios.post('https://api.brightdata.com/request', {
          zone: 'visionkeyinsights',
          url: `https://www.google.com/search?q=${userInput}&brd_json=1`,
          format: 'json'
        }, {
          headers: {
            Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })
        const data = res.data; // return JSON String
        const nestedData = JSON.parse(res.data) // parsing the string to proper JSON
        return nestedData;

      } catch (error) {
        console.error('Error in Step 1 - Get Google Search Result:', error);
        throw new Error(`Google search result failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })

    //Step 2 get Youtube search result using API

    // Step 3 to pass both result to LLM and get trending keywords

    // Step 4 to save trending keywords to database
    return googleSearchResult;
  }
)