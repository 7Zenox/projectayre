import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    // Parse incoming form data
    const formData = await req.formData();
    const imageFile = formData.get('image');
    const query = formData.get('query');

    // Debug log to see what was received
    console.log("Received formData:", { imageFile, query });

    // Input validations (returning a prediction message without sending a request)
    if (!imageFile && !query) {
      return NextResponse.json(
        { prediction: "You think you're a funny guy?" },
        { status: 200 }
      );
    }
    if (!imageFile) {
      return NextResponse.json(
        { prediction: "Hey, give me something to look at?" },
        { status: 200 }
      );
    }
    if (!query) {
      return NextResponse.json(
        { prediction: "What would you like me to answer?" },
        { status: 200 }
      );
    }

    // Ensure the query is a string
    const queryStr = typeof query === 'string' ? query : query.toString();

    // Retrieve the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { prediction: "Internal systems malfunctioning. Please try later..." },
        { status: 200 }
      );
    }

    // Wrap the user's query in a custom prompt for prompt engineering.
    const wrappedPrompt = `You are an expert in image analysis. 
Given the image provided, please answer the following question concisely: "${queryStr}"
Also add a line about the sentiment of the image. 
Do not answer anything outside the scope of the question or the image.`;

    // Convert the uploaded image file to a base64 string
    let imageBase64 = '';
    if (imageFile instanceof File) {
      const arrayBuffer = await imageFile.arrayBuffer();
      imageBase64 = Buffer.from(arrayBuffer).toString('base64');
    } else {
      return NextResponse.json(
        { prediction: "Invalid image file" },
        { status: 200 }
      );
    }

    // Initialize the Gemini client using the official library
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    // Generate content using the Gemini model
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg', // Adjust if your image format is different
        },
      },
      wrappedPrompt,
    ]);

    // Extract and possibly clean the text from the model response
    let predictionText = result.response.text();
    console.log("Raw model output:", predictionText);

    if (predictionText.startsWith("```json")) {
      predictionText = predictionText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
      console.log("Cleaned model output:", predictionText);
    }

    return NextResponse.json({ prediction: predictionText }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { prediction: "Internal systems malfunctioning. Please try later..." },
      { status: 200 }
    );
  }
}
