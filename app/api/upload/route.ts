import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const { imageBase64, filename } = await request.json()

        if (!imageBase64) {
            return NextResponse.json({ error: "Missing image data" }, { status: 400 })
        }

        // Extract base64 data without the data URL prefix
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "")

        // Convert base64 to Buffer
        const buffer = Buffer.from(base64Data, "base64")

        // Generate a unique filename if not provided
        const uploadFilename = filename || `selfie-${Date.now()}.jpg`

        // Upload to Vercel Blob
        const blob = await put(uploadFilename, buffer, {
            access: "public",
            contentType: imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg",
        })

        return NextResponse.json({ url: blob.url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Failed to upload image", message: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
        )
    }
}
