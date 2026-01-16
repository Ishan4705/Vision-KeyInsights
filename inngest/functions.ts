import { is } from "drizzle-orm";
import { inngest } from "./client";
import OpenAI from 'openai';
import Replicate from 'replicate';
import moment from 'moment';
import ImageKit from 'imagekit';
import { db } from "@/configs/db";
import { AiThumbnailTable } from "@/configs/schema";
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
  apiKey: process.env.OPENROUTER_API_KEY,
});


export const replicate=new Replicate({
  auth:process.env.REPLICATE_API_KEY
});


export const generateAiThumbnail = inngest.createFunction(
  { id: "ai/generate-thumbnail" },
  { event: "ai/generate-thumbnail " },
  async ({ event, step }) => {
    const { userEmail,userInput, refImage, faceImage } = await event.data;
    // now need to upload images to cloud/imagekit or s3
    // await step.sleep("wait-a-moment", "5s");
    // return 'Success';
    const uploadImageUrls=await step.run(
      "UploadImage",
      async()=>{
        if(refImage){
          const refImageUrl=await imageKit.upload({
            file:refImage?.buffer??'',
            fileName:refImage.name,
            isPublished:true,
            useUniqueFileName:true
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
    const generateThumbnailPrompt= await step.run('GenerateThumbnailPrompt', async()=>{
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
    const generateThumbnailImage= await step.run('Generate Image', async()=>{
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
    const uploadThumbnail=await step.run('Upload Thumbnail',async()=>{
      const imageRef=await imageKit.upload({
        file:generateThumbnailImage,
        fileName:Date.now()+'.png',
        isPublished:true,
        useUniqueFileName:false
      })
      return imageRef.url;
    })


    // save all records to database
    const SaveToDB=await step.run('SaveToDB',async()=>{
      const result=await db.insert(AiThumbnailTable).values({
        userInput:userInput,
        thumbnailUrl:uploadThumbnail,
        // for this a npm moment library is used
        createdOn:moment().format('yyyy-MM-DD'), 
        refImage:uploadImageUrls,
        userEmail:userEmail
        //@ts-ignore
      }).returning(AiThumbnailTable)
      return result;
    })

    return uploadThumbnail;
  }

)