import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, query } = body;

    if (!image || !query) {
      return NextResponse.json(
        { error: "Image and query are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 500 }
      );
    }

    // Wrap the user's query with your custom prompt for prompt engineering.
    const wrappedQuery = `You are an expert in image analysis. 
                            Only answer the question regarding the image. 
                            Given the image provided, please answer the following question in a very concise manner: "${query}"
                            Also write in very brief about what sentiment does the image convey.`;

    // Call the Gemini Vision API according to the docs.
    const geminiResponse = await fetch("https://gemini.googleapis.com/v1/vision:analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        image,
        query: wrappedQuery,
      }),
    });

    const data = await geminiResponse.json();
    return NextResponse.json({ prediction: data.answer }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
