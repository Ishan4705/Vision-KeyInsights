import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type Thumbnail={
    id:number,
    thumbnailUrl:string,
    refImageUrl:string,
    userInput:string,
}

function thumbnailList() {

    const[thumbnailList,setThumbnailList]=useState<Thumbnail[]>([]);
    const[loading,setLoading]=useState<boolean>(false);
    useEffect(()=>{
        GetThumbnailList();
    },[])

    const GetThumbnailList=async ()=>{
        setLoading(true);
        const result=await axios.get('/api/generate-thumbnail');
        console.log(result.data);
        setThumbnailList(result.data.result);
        setLoading(false);
    }

  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl'>Previously Generated Thumbnails</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
            {loading?
            [1,2,3,4,5,6,7,8].map((item,index)=>(
                <div className="flex flex-col space-y-3" key={index}>
                    <Skeleton className="w-full aspect-video rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
            ))
            :
            thumbnailList.map((thumbnail,index)=>(
                <Link href={thumbnail.thumbnailUrl} target='_blank' key={index}>
                    <Image src={thumbnail.thumbnailUrl} 
                    alt={thumbnail.thumbnailUrl} 
                    width={200}
                    height={200}
                    className='w-full aspect-video rounded-xl'/>
                </Link>
            ))
            }
        </div>
    </div>
  )
}

export default thumbnailList