"use client"

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios';
import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'

function ThumbnailSearch() {
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const onSearch = async () => {
    if (!userInput.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/thumbnail-search?query=' + encodeURIComponent(userInput));
      setVideos(res.data);
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.response?.data?.error || 'Failed to search videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className=''>
    <div className='px-10 md:px-20 lg:px-40'>
      <div className='flex flex-col items-center justify-center text-center mt-10 gap-2'>
            <h2 className='text-3xl font-bold'>Thumbnail Search: Find your best match in Seconds</h2>
            <p className='text-gray-500 text-center'>Just provide reference keywords or a title to get the best thumbnail suggestions instantly.</p>
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
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {(loading || videos.length > 0) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-lg bg-white">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          )) : videos.map((video: any) => (
            <div key={video.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{video.channelTitle}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{parseInt(video.viewCount).toLocaleString()} views</span>
                  <span>{parseInt(video.likeCount).toLocaleString()} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

export default ThumbnailSearch