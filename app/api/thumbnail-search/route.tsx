import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        // Validate input
        if (!query) {
            return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
        }

        // Check if API key exists
        if (!process.env.YOUTUBE_API_KEY) {
            return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
        }

        // Get youtube video list API by the endpoint (filtering out shorts)
        const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoDuration=medium&maxResults=21&order=relevance&key=${process.env.YOUTUBE_API_KEY}`);
        
        // Check if we got any results
        if (!result.data?.items || result.data.items.length === 0) {
            return NextResponse.json([]);
        }
        
        const videoIds = result.data.items.map((item: any) => item.id.videoId).join(',');

        // Get youtube video details by Id
        const videoResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`);

        if (!videoResult.data?.items) {
            return NextResponse.json([]);
        }

        const finalResult = videoResult.data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet?.title || 'No title',
            thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || '',
            channelTitle: item.snippet?.channelTitle || 'Unknown channel',
            publishTime: item.snippet?.publishTime || '',
            viewCount: item.statistics?.viewCount || '0',
            likeCount: item.statistics?.likeCount || '0',
            commentCount: item.statistics?.commentCount || '0',
        }));

        return NextResponse.json(finalResult);
    } catch (error: any) {
        console.error('YouTube API Error:', error.response?.data || error.message);
        return NextResponse.json({ 
            error: 'Failed to fetch videos',
            details: error.response?.data?.error?.message || error.message 
        }, { status: 500 });
    }
}