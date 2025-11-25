"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { celebrities, type Celebrity } from "@/lib/celebrities"
import type { ProcessedImage } from "@/lib/image-utils"
import { Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CelebritySelectionProps {
  userImage: ProcessedImage
  onSelect: (celebrity: Celebrity) => void
  onBack: () => void
}

export function CelebritySelection({ userImage, onSelect, onBack }: CelebritySelectionProps) {
  const [selected, setSelected] = useState<Celebrity | null>(null)

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose a Celebrity</h2>
        <p className="text-muted-foreground">Select who you'd like to transform into</p>
      </div>

      {/* User photo preview */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={userImage.base64 || "/placeholder.svg"}
            alt="Your photo"
            className="h-24 w-24 rounded-full object-cover border-4 border-primary/20"
          />
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Celebrity grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {celebrities.map((celebrity) => (
          <button
            key={celebrity.id}
            onClick={() => setSelected(celebrity)}
            className={cn(
              "group relative flex flex-col items-center gap-3 rounded-xl p-4 transition-all",
              "border-2 hover:border-primary/50 hover:bg-muted/30",
              selected?.id === celebrity.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/20",
            )}
          >
            <div className="relative">
              <img
                src={celebrity.imageUrl || "/placeholder.svg"}
                alt={celebrity.name}
                className={cn(
                  "h-20 w-20 rounded-full object-cover transition-transform",
                  "group-hover:scale-105",
                  selected?.id === celebrity.id && "ring-4 ring-primary ring-offset-2 ring-offset-background",
                )}
              />
              {selected?.id === celebrity.id && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{celebrity.name}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button size="lg" onClick={handleConfirm} disabled={!selected}>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
