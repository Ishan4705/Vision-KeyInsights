import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const generateAiThumbnail = inngest.createFunction(
  { id: "ai/generate-thumbnail" },
  { event: "ai/generate-thumbnail " },
  async ({ event, step }) => {
    const { userEmail,userInput, refImage, faceImage } = await event.data;
    // now need to upload images to cloud/imagekit or s3
    
    // generate thumbnail using ai service
    
    
    // generate image


    // save image to cloud storage

    // save image to database
    return userEmail;
  }

)