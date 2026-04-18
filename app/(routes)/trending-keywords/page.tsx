"use client"
import { Button } from '@/components/ui/button'
import { Loader2, Search, Copy, Check, TrendingUp, Hash, ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { RunStatus } from '@/services/GlobalApi';

interface KeywordItem {
    keyword: string;
    score: number;
    related_queries: string[];
}

interface KeywordsResult {
    main_keyword: string;
    keywords: KeywordItem[];
}

function TrendingKeywords() {
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [keywordsResult, setKeywordsResult] = useState<KeywordsResult | null>(null);
    const [error, setError] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<string>('');
    const [copiedField, setCopiedField] = useState<string>('');

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(''), 2000);
        } catch (err) {
            // console.error('Failed to copy:', err);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-amber-700 bg-amber-50 border-amber-300';
        if (score >= 60) return 'text-yellow-700 bg-yellow-50 border-yellow-300';
        return 'text-orange-600 bg-orange-50 border-orange-200';
    };

    const getScoreBarColor = (score: number) => {
        if (score >= 80) return 'bg-amber-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-orange-400';
    };

    const OnGenerate = async () => {
        try {
            setLoading(true);
            setError('');
            setKeywordsResult(null);
            setCurrentStep('Initializing workflow...');

            const response = await axios.get(`/api/trending-keywords?query=${encodeURIComponent(userInput.trim())}`);
            const runId = response.data.runId;

            if (!runId) {
                throw new Error('No run ID received from server');
            }

            // Polling to check status of Inngest function
            while (true) {
                const runStatus = await RunStatus(runId);
                // console.log('Run Status:', JSON.stringify(runStatus, null, 2));

                if (runStatus && runStatus[0]) {
                    const run = runStatus[0];
                    const status = run.status;

                    // Update current step from step info
                    const stepNames = Object.keys(run.output?.steps || {});
                    if (stepNames.length > 0) {
                        const latestStepName = stepNames[stepNames.length - 1];
                        const stepMap: Record<string, string> = {
                            'getGoogleSearchResult': 'Step 1: Searching Google for trending results...',
                            'Youtube Result': 'Step 2: Fetching YouTube search results...',
                            'generatekeywords': 'Step 3: Analyzing keywords with AI...',
                            'SaveToDB': 'Step 4: Saving results to database...'
                        };
                        setCurrentStep(stepMap[latestStepName] || 'Processing...');
                    }

                    if (status === 'Completed') {
                        // console.log('Workflow completed. Full run data:', JSON.stringify(run, null, 2));

                        const output = run.output;
                        let result: KeywordsResult | null = null;

                        if (output && typeof output === 'object') {
                            // The function returns SaveToDB result which is an array of DB rows
                            // Each row has a 'keywords' field containing the KeywordsResult
                            if (Array.isArray(output) && output[0]?.keywords) {
                                const kw = output[0].keywords;
                                result = typeof kw === 'string' ? JSON.parse(kw) : kw;
                            }
                            // Direct keywords result shape
                            else if (output.keywords && Array.isArray(output.keywords)) {
                                result = output as KeywordsResult;
                            }
                            // Wrapped in data
                            else if (output.data) {
                                const data = output.data;
                                if (Array.isArray(data) && data[0]?.keywords) {
                                    const kw = data[0].keywords;
                                    result = typeof kw === 'string' ? JSON.parse(kw) : kw;
                                } else if (data.keywords) {
                                    result = data as KeywordsResult;
                                }
                            }
                        }

                        if (result && result.keywords) {
                            // console.log('Parsed keywords result:', JSON.stringify(result, null, 2));
                            setKeywordsResult(result);
                        } else {
                            // console.error('Unexpected output shape:', output);
                            setError('Keywords were generated but could not be displayed. Check console for details.');
                        }
                        setCurrentStep('');
                        break;
                    } else if (status === 'Failed') {
                        const errorMsg = run.output?.error || run.output?.message || 'Workflow failed. Please try again.';
                        // console.error('Workflow failed:', run);
                        setError(typeof errorMsg === 'string' ? errorMsg : 'Workflow failed. Please try again.');
                        setCurrentStep('');
                        break;
                    }
                }

                // Wait 3 seconds before checking again
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (e) {
            // console.error("Error generating keywords:", e);
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.error || 'Failed to generate keywords');
            } else {
                setError('An unexpected error occurred');
            }
            setCurrentStep('');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='px-6 md:px-12 lg:px-20 pb-10'>
            <div className='flex flex-col items-center justify-center text-center mt-10 gap-4'>
                <h1 className='text-4xl font-bold text-black'>
                    SEO Optimized Keywords: Unlock Viral Growth
                </h1>
                <p className='text-gray-500 text-lg max-w-2xl'>
                    Generate SEO-optimized keywords that rank higher and attract more viewers.
                </p>
            </div>

            <div className='max-w-2xl p-3 border-2 border-dashed border-yellow-400 rounded-xl flex gap-3 items-center mt-10 mx-auto bg-gradient-to-r from-yellow-50 to-amber-50 hover:border-amber-500 transition-colors'>
                <input
                    type="text"
                    placeholder="Enter keywords or title (e.g., 'Next.js AI Projects')"
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    className="flex-1 border-0 rounded-md p-3 outline-none bg-white shadow-sm text-gray-700 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && !loading && userInput.trim() && OnGenerate()}
                />
                <Button
                    onClick={OnGenerate}
                    disabled={loading || !userInput.trim()}
                    className='bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Searching...
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </>
                    )}
                </Button>
            </div>

            {/* Current Step Display */}
            {loading && currentStep && (
                <div className="max-w-2xl mx-auto mt-6">
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                            <p className="text-amber-800 font-medium">{currentStep}</p>
                        </div>
                        <div className="mt-2 bg-yellow-200 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {/* Keywords Results Display */}
            {keywordsResult && keywordsResult.keywords && (
                <div className="max-w-4xl mx-auto mt-10">
                    {/* Main Keyword Header */}
                    {keywordsResult.main_keyword && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-6 w-6" />
                                    <div>
                                        <p className="text-sm opacity-80">Main Keyword</p>
                                        <h2 className="text-2xl font-bold">{keywordsResult.main_keyword}</h2>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20"
                                    onClick={() => copyToClipboard(keywordsResult.main_keyword, 'main_keyword')}
                                >
                                    {copiedField === 'main_keyword' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Keywords Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...keywordsResult.keywords].sort((a, b) => b.score - a.score).map((item, index) => (
                            <div key={index} className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-amber-500" />
                                        <h3 className="font-semibold text-gray-800">{item.keyword}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold px-2 py-1 rounded-md border ${getScoreColor(item.score)}`}>
                                            {item.score}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => copyToClipboard(item.keyword, `keyword_${index}`)}
                                        >
                                            {copiedField === `keyword_${index}` ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-400" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Score Bar */}
                                <div className="mb-3">
                                    <div className="bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(item.score)}`}
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Related Queries */}
                                {item.related_queries && item.related_queries.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium mb-2">Related Queries</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.related_queries.map((query, qIndex) => (
                                                <span
                                                    key={qIndex}
                                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1 cursor-pointer hover:bg-yellow-100 hover:text-amber-700 transition-colors"
                                                    onClick={() => copyToClipboard(query, `query_${index}_${qIndex}`)}
                                                >
                                                    <ArrowRight className="h-3 w-3" />
                                                    {query}
                                                    {copiedField === `query_${index}_${qIndex}` && <Check className="h-3 w-3 text-green-500" />}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading Skeleton State */}
            {loading && (
                <div className="max-w-4xl mx-auto mt-10">
                    <div className="mb-6 p-4 bg-gray-100 rounded-xl animate-pulse h-20"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="border rounded-xl p-5 bg-white shadow-sm">
                                <div className="animate-pulse space-y-3">
                                    <div className="flex justify-between">
                                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-5 bg-gray-200 rounded w-12"></div>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-gray-100 rounded-full w-20"></div>
                                        <div className="h-6 bg-gray-100 rounded-full w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrendingKeywords