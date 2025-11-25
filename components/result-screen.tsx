"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Celebrity } from "@/lib/celebrities"
import type { ProcessedImage } from "@/lib/image-utils"
import { Download, RefreshCw, Share2, Loader2, AlertCircle } from "lucide-react"

interface ResultScreenProps {
  userImage: ProcessedImage
  celebrity: Celebrity
  onStartOver: () => void
}

export function ResultScreen({ userImage, celebrity, onStartOver }: ResultScreenProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function generateImage() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userImageBase64: userImage.base64,
            celebrityName: celebrity.name,
            celebrityImageUrl: celebrity.imageUrl,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || data.error || "Failed to generate image")
        }

        setGeneratedImage(data.image)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    generateImage()
  }, [userImage, celebrity])

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = generatedImage
    link.download = `face-transform-${celebrity.name.toLowerCase().replace(/\s+/g, "-")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!generatedImage) return

    try {
      // Convert base64 to blob for sharing
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const file = new File([blob], `face-transform-${celebrity.name}.png`, { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Get Any Selfie - ${celebrity.name}`,
          text: `Check out my transformation as ${celebrity.name}!`,
        })
      } else {
        // Fallback: copy image URL to clipboard
        await navigator.clipboard.writeText(generatedImage)
        alert("Image copied to clipboard!")
      }
    } catch (err) {
      console.error("Share failed:", err)
    }
  }

  const handleRetry = () => {
    setGeneratedImage(null)
    setError(null)
    setIsLoading(true)
    // Re-trigger the effect by forcing a re-render
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {isLoading ? "Creating Your Transformation..." : error ? "Something Went Wrong" : "Here's Your Result!"}
        </h2>
        <p className="text-muted-foreground">
          {isLoading ? (
            "Please wait while AI works its magic"
          ) : error ? (
            error
          ) : (
            <>
              You as <span className="font-semibold text-foreground">{celebrity.name}</span>
            </>
          )}
        </p>
      </div>

      {/* Images comparison */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center space-y-2">
          <img
            src={userImage.base64 || "/placeholder.svg"}
            alt="Your photo"
            className="h-32 w-32 rounded-2xl object-cover border-4 border-muted"
          />
          <p className="text-sm text-muted-foreground">Your Photo</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
          +
        </div>

        <div className="text-center space-y-2">
          <img
            src={celebrity.imageUrl || "/placeholder.svg"}
            alt={celebrity.name}
            className="h-32 w-32 rounded-2xl object-cover border-4 border-muted"
          />
          <p className="text-sm text-muted-foreground">{celebrity.name}</p>
        </div>
      </div>

      {/* Result area */}
      <div className="text-center space-y-4">
        <div className="relative mx-auto">
          {isLoading ? (
            <div className="h-72 w-72 rounded-2xl border-4 border-primary/30 bg-muted flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating your image...</p>
            </div>
          ) : error ? (
            <div className="h-72 w-72 rounded-2xl border-4 border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-4 p-6">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm text-muted-foreground text-center">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          ) : (
            <img
              src={generatedImage || "/placeholder.svg"}
              alt="Generated result"
              className="h-72 w-72 rounded-2xl object-cover border-4 border-primary/30 shadow-xl"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        {!isLoading && !error && (
          <>
            <Button variant="outline" size="lg" onClick={handleDownload}>
              <Download className="mr-2 h-5 w-5" />
              Download
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </Button>
          </>
        )}
        <Button size="lg" onClick={onStartOver}>
          <RefreshCw className="mr-2 h-5 w-5" />
          Start Over
        </Button>
      </div>
    </div>
  )
}
