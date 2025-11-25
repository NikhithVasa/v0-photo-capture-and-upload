import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userImageBase64, celebrityName, celebrityImageUrl } = await request.json()

    if (!userImageBase64 || !celebrityName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // Extract base64 data without the data URL prefix
    const base64Data = userImageBase64.replace(/^data:image\/\w+;base64,/, "")
    const mimeType = userImageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg"

    const config = {
      responseModalities: ["IMAGE", "TEXT"],
      imageConfig: {
        imageSize: "1K" as const,
      },
    }

    const contents = [
      {
        role: "user" as const,
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: `Using the uploaded photo, generate a selfie with ${celebrityName}. The uploaded photo should be the person taking the selfie with ${celebrityName}.`,
          },
        ],
      },
    ]

    const response = await ai.models.generateContentStream({
      model: "gemini-3-pro-image-preview",
      config,
      contents,
    })

    let resultImage: string | null = null
    let resultText = ""

    for await (const chunk of response) {
      if (!chunk.candidates?.[0]?.content?.parts) continue

      for (const part of chunk.candidates[0].content.parts) {
        if (part.inlineData) {
          // Convert the image data to base64 URL
          const imageData = part.inlineData.data
          const imageMimeType = part.inlineData.mimeType || "image/png"
          resultImage = `data:${imageMimeType};base64,${imageData}`
        } else if (part.text) {
          resultText += part.text
        }
      }
    }

    if (!resultImage) {
      return NextResponse.json(
        { error: "Failed to generate image", message: resultText || "No image was returned" },
        { status: 500 },
      )
    }

    return NextResponse.json({ image: resultImage, message: resultText })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate image", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
