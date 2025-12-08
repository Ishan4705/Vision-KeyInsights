"use client"
import axios from 'axios';
import { ArrowUp, ImagePlus, User, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

function ThumbnailGenerator() {
  const[userInput,setUserInput]=useState<string>();
  const[refImage,setRefImage]=useState<any>();
  const[faceImage,setFaceImage]=useState<any>();
  const[refImagePreview,setRefImagePreview]=useState<string>();
  const[faceImagePreview,setFaceImagePreview]=useState<string>();
  const onHandlefielChange=(field:string,event:any)=>{
    const selectedFile = event.target.files[0];
    if(field === 'referenceImageUpload'){  
      setRefImage(selectedFile);
      setRefImagePreview(URL.createObjectURL(selectedFile));
    }
    else{ 
      setFaceImage(selectedFile);
      setFaceImagePreview(URL.createObjectURL(selectedFile));
    }
  }

  const onSubmit= async ()=>{
    const formData = new FormData();
    userInput && formData.append('userInput', userInput);
    refImage && formData.append('refImage', refImage);
    faceImage && formData.append('faceImage', faceImage);
    // POST api call to be implemented here
    const result= await axios.post('/api/generate-thumbnail',formData);
    console.log(result.data);
  }

  return (
    <div>
        <div className='px-10 md:px-20 lg:px-40'>
        <div className='flex flex-col items-center justify-center text-center mt-10 gap-2'>
            <h2 className='text-3xl font-bold'>Thumbnail Generator</h2>
            <p className='text-gray-500 text-center'>Turn any video into an attention-grabbing magnet in seconds. No Design Skills needed!!</p>
        </div>
        <div className='flex gap-5 items-center p-5 border rounded-xl mt-9 backgroound-secondary'>
          <textarea placeholder='Enter youtube video title/description' className='w-full outline-0 bg-transparent'
            onChange={(event)=>setUserInput(event.target.value)}
          />
          <div className='p-3 bg-gradient-to-t from-yellow-300 to-yellow-500 rounded-full cursor-pointer'
            onClick={onSubmit}>
            <ArrowUp />
          </div>
        </div>
        <div className='flex gap-4'>
          <label htmlFor="referenceImageUpload" className='w-full'>
            {!refImagePreview ? <div className='p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center mt-5 hover:scale-105 transition-all cursor-pointer'>
              <ImagePlus/>
              <h2>Reference Image</h2>
            </div>: 
                <div className='relative'>
                  <X className='absolute' onClick={()=>setRefImagePreview(undefined)}/>
                  <Image src={refImagePreview} alt="Reference Image"  width={100} height={100} className='w-[70px] h-[70px] object-cover rounded-sm'/>
                </div>}
          </label>
          <input type="file" id='referenceImageUpload' className='hidden'
            onChange={(event)=>onHandlefielChange('referenceImageUpload',event)}
          />
          <label htmlFor="faceImageUpload" className='w-full'>
          {!faceImagePreview ?<div className='p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center mt-5 hover:scale-105 transition-all cursor-pointer'>
            <User/>
            <h2>Include Face</h2>
          </div> :
              <div className='relative'>
                <X className='absolute' onClick={()=>setFaceImagePreview(undefined)}/>
                <Image src={faceImagePreview} alt="Face Image"  width={100} height={100} className='w-[70px] h-[70px] object-cover rounded-sm'/>
              </div>}
          </label>
          <input type="file" id='faceImageUpload' className='hidden' 
            onChange={(event)=>onHandlefielChange('faceImageUpload',event)}
          />
        </div>
        </div>
    </div>
  )
}

export default ThumbnailGenerator 