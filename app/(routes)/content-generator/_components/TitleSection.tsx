"use client";
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface Title {
  title: string;
  seoScore: number;
}

interface TitleSectionProps {
  titles: Title[] | null;
  loading: boolean;
  onCopy: (text: string, field: string) => void;
  copiedField: string;
}

export default function TitleSection({ titles, loading, onCopy, copiedField }: TitleSectionProps) {
  if (loading) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📝 YouTube Video Title Suggestions
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex-1">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-8 ml-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!titles) return null;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📝 YouTube Video Title Suggestions
      </h3>
      <div className="space-y-3">
        {titles.map((titleObj, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{titleObj.title}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-600 mr-2">SEO Score:</span>
                <span 
                  className={`text-sm font-semibold px-2 py-1 rounded ${
                    titleObj.seoScore >= 90 ? 'bg-green-100 text-green-800' :
                    titleObj.seoScore >= 75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {titleObj.seoScore}/100
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(titleObj.title, `title-${index}`)}
              className="ml-2"
            >
              {copiedField === `title-${index}` ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}