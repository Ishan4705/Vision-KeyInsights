import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userInput } = await req.json();
        
        if (!userInput || userInput.trim().length === 0) {
            return NextResponse.json(
                { error: 'User input is required' },
                { status: 400 }
            );
        }
        
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }

        console.log('Triggering Inngest workflow for user:', user.primaryEmailAddress?.emailAddress);
        console.log('User input:', userInput.trim());
        
        // Use Inngest send to trigger the workflow and return runId for polling
        const result = await inngest.send({
            name: "ai/generate-content",
            data: {
                userInput: userInput.trim(),
                userEmail: user.primaryEmailAddress?.emailAddress,
            },
        });
        
        console.log('Workflow triggered with runId:', result.ids[0]);
        return NextResponse.json({ success: true, runId: result.ids[0] });
        
    } catch (error) {
        console.error('Error in content generation workflow:', error);
        return NextResponse.json(
            { 
                error: 'Failed to trigger content generation workflow', 
                details: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}