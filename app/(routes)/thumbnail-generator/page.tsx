"use client"
import { ArrowUp, ImagePlus, User } from 'lucide-react'
import React, { useState } from 'react'

function ThumbnailGenerator() {
  const[userInput,setUserInput]=useState<string>();
  const[refImage,setRefImage]=useState<any>();
  const[faceImage,setFaceImage]=useState<any>();
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
          <div className='p-3 bg-gradient-to-t from-yellow-300 to-yellow-500 rounded-full'>
            <ArrowUp />
          </div>
        </div>
        <div className='flex gap-4'>
          <label htmlFor="referenceImageUpload" className='w-full'>
          <div className='p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center mt-5 hover:scale-105 transition-all cursor-pointer'>
            <ImagePlus/>
            <h2>Reference Image</h2>
          </div>
          </label>
          <input type="file" id='referenceImageUpload' className='hidden' />
          <label htmlFor="faceImageUpload" className='w-full'>
          <div className='p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center mt-5 hover:scale-105 transition-all cursor-pointer'>
            <User/>
            <h2>Include Face</h2>
          </div>
          </label>
          <input type="file" id='faceImageUpload' className='hidden' />
        </div>
        </div>
    </div>
  )
}

export default ThumbnailGenerator 