import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type Thumbnail={
    id:number,
    thumbnailUrl:string,
    refImageUrl:string,
    userInput:string,
}

function thumbnailList() {

    const[thumbnailList,setThumbnailList]=useState<Thumbnail[]>([]);

    useEffect(()=>{
        GetThumbnailList();
    },[])

    const GetThumbnailList=async ()=>{
        const result=await axios.get('/api/generate-thumbnail');
        console.log(result.data);
        setThumbnailList(result.data.result);
    }

  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl'>Previously Generated Thumbnails</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
            {thumbnailList.map((thumbnail,index)=>(
                <div key={index}>
                    <Image src={thumbnail.thumbnailUrl} 
                    alt={thumbnail.thumbnailUrl} 
                    width={200}
                    height={200}
                    className='w-full aspect-video rounded-xl'/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default thumbnailList