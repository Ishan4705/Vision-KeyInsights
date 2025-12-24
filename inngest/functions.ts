import { inngest } from "./client";

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
    
    
    // generate image


    // save image to cloud storage

    // save image to database
    return uploadImageUrls;
  }

)