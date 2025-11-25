"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CameraCapture } from "@/components/camera-capture"
import { PhotoUpload } from "@/components/photo-upload"
import { CelebritySelection } from "@/components/celebrity-selection"
import { ResultScreen } from "@/components/result-screen"
import type { ProcessedImage } from "@/lib/image-utils"
import type { Celebrity } from "@/lib/celebrities"
import { Camera, Upload, Sparkles } from "lucide-react"

type AppScreen = "home" | "camera" | "upload" | "select-celebrity" | "result"

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("home")
  const [userImage, setUserImage] = useState<ProcessedImage | null>(null)
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null)

  const handleImageCapture = async (image: ProcessedImage) => {
    try {
      // Upload image to Vercel Blob
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: image.base64,
          filename: `selfie-${Date.now()}.jpg`,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        // Add blob URL to the image object
        image.blobUrl = url
      } else {
        console.error("Failed to upload image to blob storage")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    }

    setUserImage(image)
    setScreen("select-celebrity")
  }

  const handleCelebritySelect = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity)
    setScreen("result")
  }

  const handleStartOver = () => {
    setUserImage(null)
    setSelectedCelebrity(null)
    setScreen("home")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-16">
        {/* Home Screen */}
        {screen === "home" && (
          <div className="flex flex-col items-center gap-10 text-center">
            {/* Logo/Header */}
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Sparkles className="h-10 w-10" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Get Any Selfie</h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Upload your selfie and see yourself transformed as your favorite celebrity
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Button size="lg" className="flex-1 h-14 text-lg" onClick={() => setScreen("camera")}>
                <Camera className="mr-3 h-6 w-6" />
                Take a Selfie
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-14 text-lg bg-transparent"
                onClick={() => setScreen("upload")}
              >
                <Upload className="mr-3 h-6 w-6" />
                Upload Photo
              </Button>
            </div>

            {/* Info */}
            <div className="text-sm text-muted-foreground space-y-2 max-w-xs">
              <p>Works on any device with a camera or photo library</p>
              <p className="text-xs">Your photos are processed securely and never stored</p>
            </div>
          </div>
        )}

        {/* Camera Screen */}
        {screen === "camera" && <CameraCapture onCapture={handleImageCapture} onCancel={() => setScreen("home")} />}

        {/* Upload Screen */}
        {screen === "upload" && <PhotoUpload onUpload={handleImageCapture} onCancel={() => setScreen("home")} />}

        {/* Celebrity Selection Screen */}
        {screen === "select-celebrity" && userImage && (
          <CelebritySelection userImage={userImage} onSelect={handleCelebritySelect} onBack={() => setScreen("home")} />
        )}

        {/* Result Screen */}
        {screen === "result" && userImage && selectedCelebrity && (
          <ResultScreen userImage={userImage} celebrity={selectedCelebrity} onStartOver={handleStartOver} />
        )}
      </div>
    </main>
  )
}
