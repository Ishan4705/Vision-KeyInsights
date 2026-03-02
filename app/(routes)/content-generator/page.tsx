"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { RunStatus } from '@/services/GlobalApi';
import TitleSection from './_components/TitleSection';
import DescriptionSection from './_components/DescriptionSection';
import TagsSection from './_components/TagsSection'; 
import ThumbnailSection from './_components/ThumbnailSection';

interface Title {
    title: string;
    seoScore: number;
}

interface ThumbnailPrompt {
    heading: string;
    prompt: string;
}

interface GeneratedContent {
    titles: Title[];
    description: string;
    tags: string[];
    thumbnailPrompts: ThumbnailPrompt[];
}

interface ThumbnailData {
    prompt: string;
    originalUrl: string;
    uploadedUrl: string;
    thumbnailId: string;
}

interface WorkflowResult {
    content: GeneratedContent;
    thumbnails: ThumbnailData[];
    database: any;
}

function ContentGenerator() {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [workflowResult, setWorkflowResult] = useState<WorkflowResult | null>(null);
    const [error, setError] = useState<string>('');
    const [copiedField, setCopiedField] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<string>('');
    
    const onGenerate = async () => {
        try {
            setLoading(true);
            setError('');
            setWorkflowResult(null);
            setCurrentStep('Initializing workflow...');
            
            const res = await axios.post('/api/content-generator', {
                userInput: userInput.trim()
            });
            
            const runId = res.data.runId;
            
            // Polling to check status of Inngest function
            while(true) {
                const runStatus = await RunStatus(runId);
                console.log('Run Status:', JSON.stringify(runStatus, null, 2));
                
                if (runStatus && runStatus[0]) {
                    const run = runStatus[0];
                    const status = run.status;
                    
                    // Update current step from step info if available
                    const stepNames = Object.keys(run.output?.steps || {});
                    if (stepNames.length > 0) {
                        const latestStepName = stepNames[stepNames.length - 1];
                        const stepMap: Record<string, string> = {
                            'GenerateContent': 'Step 1: Generating content with AI...',
                            'GenerateThumbnailImages': 'Step 2: Creating thumbnail images...',
                            'UploadThumbnails': 'Step 3: Uploading to cloud storage...',
                            'SaveContentToDB': 'Step 4: Saving to database...'
                        };
                        setCurrentStep(stepMap[latestStepName] || 'Processing...');
                    }
                    
                    if (status === 'Completed') {
                        console.log('Workflow completed. Full run data:', JSON.stringify(run, null, 2));
                        
                        // The Inngest output is the return value of the function
                        const output = run.output;
                        console.log('Output type:', typeof output, 'Output:', output);
                        
                        // Handle different output shapes from Inngest
                        let result: WorkflowResult | null = null;
                        
                        if (output && typeof output === 'object') {
                            // Direct workflow result shape
                            if (output.content && output.thumbnails) {
                                result = output as WorkflowResult;
                            }
                            // Sometimes Inngest wraps in data property
                            else if (output.data?.content && output.data?.thumbnails) {
                                result = output.data as WorkflowResult;
                            }
                        }
                        
                        if (result) {
                            console.log('Parsed result:', JSON.stringify(result, null, 2));
                            setWorkflowResult(result);
                        } else {
                            console.error('Unexpected output shape:', output);
                            setError('Content was generated but could not be displayed. Check console for details.');
                        }
                        setCurrentStep('');
                        break;
                    } else if (status === 'Failed') {
                        const errorMsg = run.output?.error || run.output?.message || 'Workflow failed. Please try again.';
                        console.error('Workflow failed:', run);
                        setError(typeof errorMsg === 'string' ? errorMsg : 'Workflow failed. Please try again.');
                        setCurrentStep('');
                        break;
                    }
                }
                
                // Wait 3 seconds before checking again
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error("Error generating content:", error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || 'Failed to generate content');
            } else {
                setError('An unexpected error occurred');
            }
            setCurrentStep('');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div>
            <div className='px-6 md:px-12 lg:px-20 pb-10'>
                <div className='flex flex-col items-center justify-center text-center mt-10 gap-4'>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent'>
                        AI Content Generator
                    </h1>
                    <p className='text-gray-600 text-lg max-w-2xl'>
                        Transform your ideas into ready-to-publish content with AI-powered titles, descriptions, tags, and custom thumbnails
                    </p>
                </div>
                
                <div className='max-w-3xl p-4 border-2 border-dashed border-yellow-300 rounded-xl flex gap-3 items-center mt-10 mx-auto bg-gradient-to-r from-yellow-50 to-amber-50 hover:border-yellow-500 transition-colors'>
                    <input 
                        type="text" 
                        placeholder="Enter your content idea (e.g., 'How to learn React development')"
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        className="flex-1 border-0 rounded-md p-3 outline-none bg-white shadow-sm text-gray-700 placeholder-gray-500"
                        onKeyPress={(e) => e.key === 'Enter' && !loading && userInput.trim() && onGenerate()}
                    />
                    <Button 
                        onClick={onGenerate} 
                        disabled={loading || !userInput.trim()} 
                        className='bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-500 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Settings className="mr-2 h-5 w-5" />
                                Generate Content
                            </>
                        )}
                    </Button>
                </div>

                {/* Current Step Display */}
                {loading && currentStep && (
                    <div className="max-w-3xl mx-auto mt-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                                <p className="text-yellow-800 font-medium">{currentStep}</p>
                            </div>
                            <div className="mt-2 bg-yellow-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Generated Content Display */}
                {workflowResult && workflowResult.content && (
                    <div className="max-w-7xl mx-auto mt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <TitleSection 
                                    titles={workflowResult.content.titles}
                                    loading={false}
                                    onCopy={copyToClipboard}
                                    copiedField={copiedField}
                                />
                            </div>
                            
                            {/* Right Column */}
                            <div className="space-y-6">
                                <DescriptionSection 
                                    description={workflowResult.content.description}
                                    loading={false}
                                    onCopy={copyToClipboard}
                                    copiedField={copiedField}
                                />
                            </div>
                        </div>
                        
                        {/* Full Width Tags Section */}
                        <div className="mt-6">
                            <TagsSection 
                                tags={workflowResult.content.tags}
                                loading={false}
                                onCopy={copyToClipboard}
                                copiedField={copiedField}
                            />
                        </div>
                        
                        {/* Full Width Thumbnail Section */}
                        <div className="mt-6">
                            <ThumbnailSection 
                                thumbnails={workflowResult.thumbnails}
                                thumbnailPrompts={workflowResult.content.thumbnailPrompts}
                                loading={false}
                                onCopy={copyToClipboard}
                                copiedField={copiedField}
                            />
                        </div>
                    </div>
                )}

                {/* Loading State for Content */}
                {loading && (
                    <div className="max-w-7xl mx-auto mt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <TitleSection 
                                    titles={null}
                                    loading={true}
                                    onCopy={copyToClipboard}
                                    copiedField={copiedField}
                                />
                            </div>
                            
                            <div className="space-y-6">
                                <DescriptionSection 
                                    description={null}
                                    loading={true}
                                    onCopy={copyToClipboard}
                                    copiedField={copiedField}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <TagsSection 
                                tags={null}
                                loading={true}
                                onCopy={copyToClipboard}
                                copiedField={copiedField}
                            />
                        </div>
                        
                        <div className="mt-6">
                            <ThumbnailSection 
                                thumbnails={null}
                                thumbnailPrompts={null}
                                loading={true}
                                onCopy={copyToClipboard}
                                copiedField={copiedField}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContentGenerator;