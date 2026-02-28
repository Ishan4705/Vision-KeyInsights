import React from 'react';
import { VideoInfoOutlier } from '../page';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type VideoOutlierCardProps = {
  videoInfo: VideoInfoOutlier;
}

function VideoOutlierCard({ videoInfo }: VideoOutlierCardProps) {
  const formatNumber = (num: number | string, removeDecimals = false) => {
    const numValue = typeof num === 'string' ? parseInt(num) || 0 : num || 0;
    return removeDecimals ? Math.floor(numValue).toLocaleString() : numValue.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    try {
      // Handle ISO format like "2024-09-07T16:34:48.000Z"
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch {
      return 'Invalid date';
    }
  };

  const getOutlierBadgeColor = (isOutlier: boolean) => {
    return isOutlier ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handle different possible field names for view count and date
  const viewCount = videoInfo.viwCount || (videoInfo as any).viewCount || 0;
  const publishDate = videoInfo.publishedAt || (videoInfo as any).publishTime || '';
  const viewsPerDayValue = videoInfo.viewsPerDay || (videoInfo as any).viewPerDay || 0;
  
  // Debug: Log the actual data structure (remove this after fixing)
  // console.log('VideoInfo:', videoInfo);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img 
          src={videoInfo.thumbnail} 
          alt={videoInfo.title} 
          className="w-full aspect-video object-cover" 
        />
        {videoInfo.isOutlier && (
          <div className="absolute top-2 right-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full cursor-pointer">
                  Outlier
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-large text-black">Outlier Video</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This video shows unusual performance patterns compared to similar content.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Score calculated by analyzing views, engagement rate, and performance vs channel average.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-base mb-2 line-clamp-2 text-gray-900">
          {videoInfo.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          {videoInfo.channelTitle}
        </p>
        
        <div className="text-sm text-gray-500 mb-3">
          <span>{formatNumber(viewCount)} views • {formatDate(publishDate)}</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Likes:</span>
            <span className="font-medium">{formatNumber(videoInfo.likeCount || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Comments:</span>
            <span className="font-medium">{formatNumber(videoInfo.commentCount || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Views/Day:</span>
            <span className="font-medium">{formatNumber(viewsPerDayValue, true)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Smart Score:</span>
            <span className={`font-bold ${getScoreColor(videoInfo.smartScore || 0)}`}>
              {(videoInfo.smartScore || 0).toFixed(1)}/10
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Outlier Score:</span>
            <span className={`font-bold ${getScoreColor(videoInfo.outlierScore || 0)}`}>
              {(videoInfo.outlierScore || 0).toFixed(1)}/10
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Engagement:</span>
            <span className="font-bold text-blue-600">
              {((videoInfo.engagementRate || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoOutlierCard;