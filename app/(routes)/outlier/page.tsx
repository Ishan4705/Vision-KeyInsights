"use client"
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react'
import VideoOutlierCard from './_components/VideoOutlierCard';


export type VideoInfoOutlier = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    viwCount: number;
    likeCount: number;
    commentCount: number;
    smartScore: number;
    outlierScore: number;
    viewsPerDay: number;
    isOutlier: boolean;
    engagementRate: number;
}

function Outlier() {
    const [userInput, setUserInput] = useState<string>('');
    const[loading,setLoading]=useState(false);
    const [error, setError] = useState<string>('');
    const [videoList,setVideoList]=useState<VideoInfoOutlier[]>([]);
    const onSearch=async ()=>{
        if (!userInput.trim()) return;
    
        try {
            setLoading(true);
            setError('');
            const res = await axios.get('/api/outlier?query=' + encodeURIComponent(userInput));
            const sortedResults = res.data.sort((a: VideoInfoOutlier, b: VideoInfoOutlier) => {
                // Outlier videos first
                if (a.isOutlier && !b.isOutlier) return -1;
                if (!a.isOutlier && b.isOutlier) return 1;
                // Then sort by outlier score descending
                return b.outlierScore - a.outlierScore;
            });
            setVideoList(sortedResults);
        } catch (error: any) {
            console.error('Search error:', error);
            setError(error.response?.data?.error || 'Failed to search videos');
            setVideoList([]);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div>
        <div className='px-10 md:px-20 lg:px-40'>
            <div className='flex flex-col items-center justify-center text-center mt-10 gap-2'>
            <h2 className='text-3xl font-bold'>Outlier: Catch the Odd Ones Instantly</h2>
            <p className='text-gray-500 text-center'>Easily find out videos by spotting outliers in views,likes and engagement. Also, can analyse the video's reach with intelligent scoring to optimize growth.</p>
      </div>
      <div className='max-w-2xl p-2 border rounded-xl flex gap-2 items-center mt-10 mx-auto bg-secondary'>
        <input 
          type="text" 
          placeholder="Enter keywords or title"
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full outline-none bg-transparent"
          onKeyPress={(e) => e.key === 'Enter' && !loading && userInput.trim() && onSearch()}
        />
        <Button 
          onClick={onSearch} 
          disabled={loading || !userInput.trim()} 
          className='bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Loading
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {(loading || videoList.length > 0) && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-10 md:px-20 lg:px-40'>
              {loading ? [1, 2, 3, 4, 5, 6].map((item, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Skeleton className="w-full aspect-video" />
                      <div className="p-4">
                          <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                              <div className="flex justify-between pt-2">
                                  <Skeleton className="h-3 w-20" />
                                  <Skeleton className="h-3 w-16" />
                              </div>
                          </div>
                      </div>
                  </div>
              )) : videoList?.map((video, index) => (
                  <VideoOutlierCard key={video.id || index} videoInfo={video} />
              ))}
          </div>
        )}
    </div>
  )
}

export default Outlier