"use client"
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import VideoOutlierCard from '../outlier/_components/VideoOutlierCard'

function TrendingKeywords() {
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const OnGenerate = () => {

    }
    return (
        <div className='px-10 md:px-20  lg:px-40'>
            <div className='flex flex-col items-center justify-center text-center mt-10 gap-2'>
                <h2 className='text-3xl font-bold'>SEO Optimized Keywords: Unlock Viral Growth</h2>
                <p className='text-gray-500 text-center'>   Generate SEO-optimized keywords that rank higher and attract more viewers.</p>
            </div>
            <div className='max-w-2xl p-2 border rounded-xl flex gap-2 items-center mt-10 mx-auto bg-secondary'>
                <input
                    type="text"
                    placeholder="Enter keywords or title"
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full outline-none bg-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && !loading && userInput.trim() && OnGenerate()}
                />
                <Button
                    onClick={OnGenerate}
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
    )
}

export default TrendingKeywords