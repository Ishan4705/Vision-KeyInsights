"use client";
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface ThumbnailData {
  prompt: string;
  originalUrl?: string;
  uploadedUrl?: string;
  thumbnailId?: string;
}

interface ThumbnailPrompt {
  heading: string;
  prompt: string;
}

interface ThumbnailSectionProps {
  thumbnails: ThumbnailData[] | null;
  thumbnailPrompts: ThumbnailPrompt[] | string[] | null;
  loading: boolean;
  onCopy: (text: string, field: string) => void;
  copiedField: string;
}

export default function ThumbnailSection({ thumbnails, thumbnailPrompts, loading, onCopy, copiedField }: ThumbnailSectionProps) {
  if (loading) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm col-span-2">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🎨 AI Generated Thumbnails
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div key={index} className="border border-yellow-200 rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show prompts if thumbnails are not generated yet
  if (!thumbnails && thumbnailPrompts) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm col-span-2">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🖼️ Thumbnail Prompts
        </h3>
        <div className="space-y-4">
          {thumbnailPrompts.map((prompt, index) => {
            const promptText = typeof prompt === 'string' ? prompt : prompt.prompt;
            const heading = typeof prompt === 'string' ? `Concept ${index + 1}` : prompt.heading;
            return (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-700">{heading}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(promptText, `thumbnail-prompt-${index}`)}
                  >
                    {copiedField === `thumbnail-prompt-${index}` ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-gray-600 leading-relaxed">{promptText}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!thumbnails) return null;

  return (
    <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm col-span-2">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🎨 AI Generated Thumbnails
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {thumbnails.map((thumbnail, index) => (
          <div key={index} className="border border-yellow-200 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-50 to-white">
            {thumbnail.uploadedUrl && (
              <div className="relative">
                <img 
                  src={thumbnail.uploadedUrl} 
                  alt={`AI Generated Thumbnail ${index + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                  <span className="text-white text-xs font-bold px-2">{index + 1}</span>
                </div>
              </div>
            )}
            <div className="p-4">
              <h5 className="font-semibold mb-2 text-gray-800">Thumbnail {index + 1}</h5>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {thumbnail.prompt.length > 120 ? `${thumbnail.prompt.substring(0, 120)}...` : thumbnail.prompt}
              </p>
              <div className="flex gap-2 flex-wrap">
                {thumbnail.uploadedUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(thumbnail.uploadedUrl, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Full Size
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopy(thumbnail.prompt, `thumbnail-prompt-${index}`)}
                >
                  {copiedField === `thumbnail-prompt-${index}` ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy Prompt
                </Button>
                {thumbnail.uploadedUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(thumbnail.uploadedUrl!, `thumbnail-url-${index}`)}
                  >
                    {copiedField === `thumbnail-url-${index}` ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy URL
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}