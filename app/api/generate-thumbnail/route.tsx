import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const refImage = formData.get('refImage');
    const faceImage = formData.get('faceImage');
    const userInput = formData.get('userInput');
}
