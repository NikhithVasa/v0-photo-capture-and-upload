"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { processImage, validateImageFile, type ProcessedImage } from "@/lib/image-utils"
import { ImageIcon, X, Check, AlertTriangle } from "lucide-react"

interface PhotoUploadProps {
  onUpload: (image: ProcessedImage) => void
  onCancel: () => void
}

export function PhotoUpload({ onUpload, onCancel }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file: File) => {
    setError(null)

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    setSelectedFile(file)
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleConfirm = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    try {
      const processed = await processImage(selectedFile)
      onUpload(processed)
    } catch (err) {
      setError("Failed to process image. Please try another photo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Show preview with confirm/reset
  if (preview && selectedFile) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative overflow-hidden rounded-2xl border-4 border-primary/20">
          <img
            src={preview || "/placeholder.svg"}
            alt="Selected photo"
            className="max-h-[60vh] max-w-full object-contain"
          />
        </div>

        <p className="text-sm text-muted-foreground">{selectedFile.name}</p>

        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={handleReset} disabled={isProcessing}>
            <X className="mr-2 h-5 w-5" />
            Choose Another
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

  // Show upload interface
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex h-64 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-medium">Drop your photo here</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 max-w-sm">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center max-w-xs">Supports JPEG, PNG, and WebP. Max 10MB.</p>

      <Button variant="outline" size="lg" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
