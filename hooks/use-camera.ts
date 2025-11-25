"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"

export type CameraStatus = "idle" | "requesting" | "active" | "denied" | "not-found" | "error"

interface UseCameraReturn {
  status: CameraStatus
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  startCamera: () => Promise<void>
  stopCamera: () => void
  capturePhoto: () => HTMLCanvasElement | null
  errorMessage: string | null
}

export function useCamera(): UseCameraReturn {
  const [status, setStatus] = useState<CameraStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStatus("idle")
  }, [])

  const startCamera = useCallback(async () => {
    setStatus("requesting")
    setErrorMessage(null)

    // Check if camera API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("not-found")
      setErrorMessage("Camera not supported on this browser.")
      return
    }

    try {
      // Check for available video devices first
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === "videoinput")

      if (videoDevices.length === 0) {
        setStatus("not-found")
        setErrorMessage("No camera detected on this device. Please upload a photo instead.")
        return
      }

      // Request camera with front-facing preference
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Front camera for selfies
          width: { ideal: 1024 },
          height: { ideal: 1024 },
        },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStatus("active")
      }
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setStatus("denied")
          setErrorMessage("Camera access is blocked. Enable it in your device settings or use 'Upload photo' instead.")
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setStatus("not-found")
          setErrorMessage("No camera detected on this device. Please upload a photo instead.")
        } else {
          setStatus("error")
          setErrorMessage(
            "We couldn't access your camera. Please check browser permissions or use 'Upload photo' instead.",
          )
        }
      } else {
        setStatus("error")
        setErrorMessage("An unexpected error occurred. Please try again or upload a photo.")
      }
    }
  }, [])

  const capturePhoto = useCallback((): HTMLCanvasElement | null => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    // Set canvas size to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Mirror the image horizontally for selfie effect
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    return canvas
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    status,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    errorMessage,
  }
}
