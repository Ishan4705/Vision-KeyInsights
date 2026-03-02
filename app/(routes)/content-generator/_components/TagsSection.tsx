"use client";
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface TagsSectionProps {
  tags: string[] | null;
  loading: boolean;
  onCopy: (text: string, field: string) => void;
  copiedField: string;
}

export default function TagsSection({ tags, loading, onCopy, copiedField }: TagsSectionProps) {
  if (loading) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            🏷️ YouTube Video Tags
          </h3>
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!tags) return null;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          🏷️ YouTube Video Tags
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(tags.join(', '), 'tags')}
        >
          {copiedField === 'tags' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-300 hover:shadow-sm hover:border-yellow-400 transition-all"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}