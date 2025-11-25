// Celebrity/Persona data - easily add more by adding to this array
export interface Celebrity {
  id: string
  name: string
  imageUrl: string
}

// Replace these with actual public URLs (CloudFront, pre-signed URLs, or public S3 bucket URLs)
export const celebrities: Celebrity[] = [
  {
    id: "sreelela",
    name: "Sreelela",
    imageUrl: "/sreelela-actress-portrait.jpg",
  },
  {
    id: "srikanth",
    name: "Srikanth",
    imageUrl: "/srikanth-actor-portrait.jpg",
  },
  {
    id: "vijay",
    name: "Vijay",
    imageUrl: "/vijay-actor-portrait.jpg",
  },
  {
    id: "allu-arjun",
    name: "Allu Arjun",
    imageUrl: "/allu-arjun-portrait.png",
  },
  {
    id: "nani",
    name: "Nani",
    imageUrl: "/nani-actor-portrait.jpg",
  },
  {
    id: "chiranjeevi",
    name: "Chiranjeevi",
    imageUrl: "/chiranjeevi-actor-portrait.jpg",
  },
  {
    id: "prabhas",
    name: "Prabhas",
    imageUrl: "/prabhas-actor-portrait.jpg",
  },
]

// Helper function to add a new celebrity
export function addCelebrity(name: string, imageUrl: string): Celebrity {
  const id = name.toLowerCase().replace(/\s+/g, "-")
  return { id, name, imageUrl }
}
