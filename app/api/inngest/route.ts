import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { generateAIContent, generateAiThumbnail, getTrendingKeywords } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateAiThumbnail,
    generateAIContent,
    getTrendingKeywords
  ],
});