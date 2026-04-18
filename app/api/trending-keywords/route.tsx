import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userInput = searchParams.get('query');

        if (!userInput || userInput.trim().length === 0) {
            return NextResponse.json(
                { error: 'Query parameter is required' },
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

        console.log('Triggering trending keywords workflow for user:', user.primaryEmailAddress?.emailAddress);
        console.log('User input:', userInput.trim());

        const result = await inngest.send({
            name: "ai/get-trending-keywords",
            data: {
                userInput: userInput.trim(),
                userEmail: user?.primaryEmailAddress?.emailAddress,
            },
        });

        console.log('Workflow triggered with runId:', result.ids[0]);
        return NextResponse.json({ success: true, runId: result.ids[0] });
    } catch (error) {
        console.error('Error in trending keywords workflow:', error);
        return NextResponse.json(
            {
                error: 'Failed to trigger trending keywords workflow',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}