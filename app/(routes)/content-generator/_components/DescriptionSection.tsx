"use client";
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface DescriptionSectionProps {
  description: string | null;
  loading: boolean;
  onCopy: (text: string, field: string) => void;
  copiedField: string;
}

export default function DescriptionSection({ description, loading, onCopy, copiedField }: DescriptionSectionProps) {
  if (loading) {
    return (
      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            📄 YouTube Video Description
          </h3>
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!description) return null;

  return (
    <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          📄 YouTube Video Description
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(description, 'description')}
        >
          {copiedField === 'description' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{description}</p>
      </div>
    </div>
  );
}