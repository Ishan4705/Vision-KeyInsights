import React from 'react'
import Image from 'next/image'
import Link from 'next/link';

const Features=[
  {
    id:1,
    title:"Thumbnail Generator",
    image:"/feature1.png",
    path:"/thumbnail-generator",
  },
  {
    id:2,
    title:"Search Thumbnail",
    image:"/feature2.png",
    path:"/thumbnail-search",
  },
  {
    id:3,
    title:"Outlier",
    image:"/feature3.png",
    path:"/outlier",
  },
  {
    id:4,
    title:"Content Generator",
    image:"/feature4.png",
    path:"/content-generator",
  },
  {
    id:5,
    title:"Trending Keywords",
    image:"/feature5.png",
    path:"/trending-keywords",
  },
  {
    id:6,
    title:"Optimize Video",
    image:"/feature6.png",
    path:"/optimize-video",
  }
]

function FeatureList() {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-2xl mb-4'>Tools For Creators</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {Features.map((feature,index ) =>(
          <Link href={feature.path} key={index}>
          <Image src={feature.image} alt={feature.title}
            width={200}
            height={200}
            className='w-full object-cover rounded-xl hover:scale-105 transition-all' />
          </Link>
        ))}</div>
    </div>
  )
}

export default FeatureList