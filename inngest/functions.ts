import { inngest } from "./client";
import OpenAI from 'openai';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

//@ts-ignore
const imageKit=new ImageKit({
  publicKey:process.env.ImageKit_PUBLIC_KEY,
  privateKey:process.env.ImageKit_PRIVATE_KEY,
  urlEndpoint:process.env.ImageKit_URL_ENDPOINT
})


export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});



export const generateAiThumbnail = inngest.createFunction(
  { id: "ai/generate-thumbnail" },
  { event: "ai/generate-thumbnail " },
  async ({ event, step }) => {
    const { userEmail,userInput, refImage, faceImage } = await event.data;
    // now need to upload images to cloud/imagekit or s3
    
    const uploadImageUrls=await step.run(
      "UploadImage",
      async()=>{
        if(!refImage){
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

    // generate thumbnail using ai service
    const generateThumbnailPrompt= await step.run('GenerateThumbnailPrompt', async()=>{
       const completion = await openai.chat.completions.create({
       model: 'google/gemini-2.5-flash',
       messages: [
       {
          role: 'user',
          content:[
            {
            "type": "text",
            "text": uploadImageUrls?`Refering to this thumbnail url write a text prompt to generate 
            youtube thumbnail similar to the attached reference image with the following user input:`+ userInput+'Only give me text prompt,No other comment text':
            `Depends on user input write a text prompt to generate high quality professional youtube thumbnail prompt,Make sure to
            Add relavent icons,illustrations or images as per title. UserInput:`+ userInput+'.Only give me text prompt,No other comment text'
          },
          {
            "type": "image_url",
            "image_url": {
              "url": uploadImageUrls??``,
            }
          },
          ],
        },
      ],
      });

      console.log(completion.choices[0].message.content);
      return completion.choices[0].message.content;

    })
    
    // generate image


    // save image to cloud storage

    // save image to database
    return generateThumbnailPrompt;
  }

)