import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try{
    const { searchParams } = new URL(req.url);
    let query=searchParams.get('query');
    
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoDuration=medium&maxResults=21&order=relevance&key=${process.env.YOUTUBE_API_KEY}`);
        
        // Check if we got any results
        if (!result.data?.items || result.data.items.length === 0) {
            return NextResponse.json([]);
        }
        
        const videos = result.data.items.map((item: any) => item.id.videoId).join(',');

        // Get youtube video details by Id
        const videoResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videos}&key=${process.env.YOUTUBE_API_KEY}`);

        if (!videoResult.data?.items) {
            return NextResponse.json([]);
        }

        const finalResult = videoResult.data.items.map((item: any) => {
            const today = new Date();
            const viewCount = parseInt(item.statistics?.viewCount || '0');
            const likeCount = parseInt(item.statistics?.likeCount || '0');
            const commentCount = parseInt(item.statistics?.commentCount || '0');

            const publishDate=new Date(item.snippet?.publishedAt); 
            const daysSincePublished = Math.max((today.getTime()-publishDate.getTime())/(1000*60*60*24),1);
            const viewPerDay = viewCount / daysSincePublished;
            const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;

            return {
            id: item.id,
            title: item.snippet?.title || 'No title',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
            channelTitle: item.snippet?.channelTitle || 'Unknown channel',
            publishTime: publishDate,
            viewCount: item.statistics?.viewCount || '0',
            likeCount: item.statistics?.likeCount || '0',
            commentCount: item.statistics?.commentCount || '0',
            viewPerDay: viewPerDay,
            engagementRate: engagementRate,
            }
        });

        const viewCounts = finalResult.map((v: any) => parseInt(v.viewCount));
        const {iqr, lowerBound, upperBound} = calculateIQR(viewCounts);
        const avgViews = viewCounts.reduce((a:any,b:any)=> a + b, 0)/ viewCounts.length;
        const maxViewsPerDay = Math.max(...finalResult.map((v: any) => v.viewPerDay));
        const maxEngagementRate = Math.max(...finalResult.map((v: any) => v.engagementRate));

        const finalResultWithOutliers = finalResult.map((v: any) => {
            const isOutlier = v.viewCount < lowerBound || v.viewCount > upperBound;
            let outlierScore = 0;
            if (isOutlier && iqr > 0) {
                if (v.viewCount > upperBound) {
                    outlierScore = (v.viewCount - upperBound) / iqr;
                } else {
                    outlierScore = (lowerBound - v.viewCount) / iqr;
                }
            }
            const smartScore = (v.viewCount/avgViews)* 0.5 + (v.viewPerDay/ maxViewsPerDay)* 0.3 + (v.engagementRate / maxEngagementRate) * 0.2;
            return {...v, engagementRate: Number(v?.engagementRate.toFixed(2)), viewsPerDay: Math.round(v.viewsPerDay), smartScore: Number(smartScore?.toFixed(3)), isOutlier, outlierScore: Number(outlierScore?.toFixed(2))};
        });

        return NextResponse.json(finalResultWithOutliers);
    } catch (error: any) {
        console.error('YouTube API Error:', error.response?.data || error.message);
        return NextResponse.json({ 
            error: 'Failed to fetch videos',
            details: error.response?.data?.error?.message || error.message 
        }, { status: 500 });
    }
}

function calculateIQR(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    const q1=sorted[Math.floor(sorted.length/4)];
    const q3=sorted[Math.floor((sorted.length*3)/4)];
    const iqr=q3-q1;
    const lowerBound=q1-1.5*iqr;
    const upperBound=q3+1.5*iqr;
    return {q1,q3,iqr,lowerBound,upperBound};
}