// Image processing utilities for downscaling and converting to base64

const TARGET_SIZE = 1024
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export interface ProcessedImage {
  base64: string
  width: number
  height: number
  size: number
  blobUrl?: string
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ["image/jpeg", "image/png", "image/webp"]

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a JPEG, PNG, or WebP image." }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Image is too large. Please upload an image under 10MB." }
  }

  return { valid: true }
}

export async function processImage(source: File | Blob | HTMLCanvasElement): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    if (source instanceof HTMLCanvasElement) {
      // Already a canvas, just process it
      const processed = downscaleCanvas(source)
      resolve(processed)
      return
    }

    // File or Blob - load into image first
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not create canvas context"))
        return
      }

      // Calculate dimensions maintaining aspect ratio
      let { width, height } = img

      if (width > TARGET_SIZE || height > TARGET_SIZE) {
        if (width > height) {
          height = Math.round((height / width) * TARGET_SIZE)
          width = TARGET_SIZE
        } else {
          width = Math.round((width / height) * TARGET_SIZE)
          height = TARGET_SIZE
        }
      }

      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      const processed = downscaleCanvas(canvas)
      resolve(processed)
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(source)
  })
}

function downscaleCanvas(canvas: HTMLCanvasElement): ProcessedImage {
  const base64 = canvas.toDataURL("image/jpeg", 0.85)
  const size = Math.round((base64.length * 3) / 4) // Approximate size in bytes

  return {
    base64,
    width: canvas.width,
    height: canvas.height,
    size,
  }
}

export function checkImageBrightness(canvas: HTMLCanvasElement): { isDark: boolean; brightness: number } {
  const ctx = canvas.getContext("2d")
  if (!ctx) return { isDark: false, brightness: 128 }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  let totalBrightness = 0
  const pixelCount = data.length / 4

  for (let i = 0; i < data.length; i += 4) {
    // Calculate perceived brightness using luminosity formula
    const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    totalBrightness += brightness
  }

  const averageBrightness = totalBrightness / pixelCount

  return {
    isDark: averageBrightness < 60,
    brightness: averageBrightness,
  }
}
