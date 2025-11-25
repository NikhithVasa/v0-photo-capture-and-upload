"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCamera } from "@/hooks/use-camera"
import { processImage, checkImageBrightness, type ProcessedImage } from "@/lib/image-utils"
import { Camera, RotateCcw, Check, X, AlertTriangle } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (image: ProcessedImage) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const { status, videoRef, canvasRef, startCamera, stopCamera, capturePhoto, errorMessage } = useCamera()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [brightnessWarning, setBrightnessWarning] = useState<string | null>(null)

  const handleStartCamera = async () => {
    await startCamera()
  }

  const handleCapture = () => {
    const canvas = capturePhoto()
    if (canvas) {
      // Check brightness
      const { isDark } = checkImageBrightness(canvas)
      if (isDark) {
        setBrightnessWarning(
          "Your photo looks a bit dark. For best results, try again in better light or upload a clearer photo.",
        )
      } else {
        setBrightnessWarning(null)
      }

      setCapturedCanvas(canvas)
      setCapturedImage(canvas.toDataURL("image/jpeg", 0.85))
      stopCamera()
    }
  }

  const handleRetake = async () => {
    setCapturedImage(null)
    setCapturedCanvas(null)
    setBrightnessWarning(null)
    await startCamera()
  }

  const handleConfirm = async () => {
    if (!capturedCanvas) return

    setIsProcessing(true)
    try {
      const processed = await processImage(capturedCanvas)
      onCapture(processed)
    } catch (error) {
      console.error("Failed to process image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    stopCamera()
    onCancel()
  }

  // Show error state
  if (status === "denied" || status === "not-found" || status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Camera Unavailable</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{errorMessage}</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Go Back
        </Button>
      </div>
    )
  }

  // Show captured image preview
  if (capturedImage) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative overflow-hidden rounded-2xl border-4 border-primary/20">
          <img
            src={capturedImage || "/placeholder.svg"}
            alt="Captured selfie"
            className="max-h-[60vh] max-w-full object-contain"
          />
        </div>

        {brightnessWarning && (
          <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 max-w-sm">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-600 dark:text-amber-400">{brightnessWarning}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={handleRetake} disabled={isProcessing}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Retake
          </Button>
          <Button size="lg" onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                Use Photo
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Show camera view or start button
  return (
    <div className="flex flex-col items-center gap-6">
      {status === "idle" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-64 w-64 items-center justify-center rounded-full bg-muted/50 border-2 border-dashed border-muted-foreground/30">
            <Camera className="h-24 w-24 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            We'll need camera access to take your selfie. This will open your front camera.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleStartCamera}>
              <Camera className="mr-2 h-5 w-5" />
              Open Camera
            </Button>
          </div>
        </div>
      )}

      {status === "requesting" && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-64 w-64 animate-pulse rounded-full bg-muted" />
          <p className="text-sm text-muted-foreground">Requesting camera access...</p>
        </div>
      )}

      {status === "active" && (
        <>
          <div className="relative overflow-hidden rounded-2xl border-4 border-primary/20">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-h-[60vh] max-w-full object-cover scale-x-[-1]"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={handleCancel}>
              <X className="mr-2 h-5 w-5" />
              Cancel
            </Button>
            <Button size="lg" onClick={handleCapture}>
              <Camera className="mr-2 h-5 w-5" />
              Capture
            </Button>
          </div>
        </>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
