// Celebrity/Persona data - easily add more by adding to this array
export interface Celebrity {
  id: string
  name: string
  imageUrl: string
}

// Replace these with actual public URLs (CloudFront, pre-signed URLs, or public S3 bucket URLs)
export const celebrities: Celebrity[] = [
  // Tollywood Heroines
  {
    id: "sreelela",
    name: "Tollywood Heroine Sreelela",
    imageUrl: "/tolliwoodheroine-sreelela-actress-portrait.jpg",
  },
  {
    id: "samantha",
    name: "Tollywood Heroine Samantha Ruth Prabhu",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "rashmika-mandanna",
    name: "Tollywood Heroine Rashmika Mandanna",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "pooja-hegde",
    name: "Tollywood Heroine Pooja Hegde",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "kajal-aggarwal",
    name: "Tollywood Heroine Kajal Aggarwal",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "anushka-shetty",
    name: "Tollywood Heroine Anushka Shetty",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "keerthy-suresh",
    name: "Tollywood Heroine Keerthy Suresh",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "sai-pallavi",
    name: "Tollywood Heroine Sai Pallavi",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "nithya-menen",
    name: "Tollywood Heroine Nithya Menen",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "tamannaah",
    name: "Tollywood Heroine Tamannaah Bhatia",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "shruti-haasan",
    name: "Tollywood Heroine Shruti Haasan",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "rakul-preet",
    name: "Tollywood Heroine Rakul Preet Singh",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "mehreen-pirzada",
    name: "Tollywood Heroine Mehreen Pirzada",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "raashi-khanna",
    name: "Tollywood Heroine Raashi Khanna",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "lavanya-tripathi",
    name: "Tollywood Heroine Lavanya Tripathi",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "regina-cassandra",
    name: "Tollywood Heroine Regina Cassandra",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "nabha-natesh",
    name: "Tollywood Heroine Nabha Natesh",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "krithi-shetty",
    name: "Tollywood Heroine Krithi Shetty",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "mrunal-thakur",
    name: "Tollywood Heroine Mrunal Thakur",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "sree-leela",
    name: "Tollywood Heroine Sree Leela",
    imageUrl: "/placeholder.svg",
  },

  // Tollywood Heroes
  {
    id: "srikanth",
    name: "Tollywood Hero Srikanth",
    imageUrl: "/tolliwoodhero-srikanth-actor-portrait.jpg",
  },
  {
    id: "allu-arjun",
    name: "Tollywood Hero Allu Arjun",
    imageUrl: "/tolliwoodhero-allu-arjun-portrait.png",
  },
  {
    id: "prabhas",
    name: "Tollywood Hero Prabhas",
    imageUrl: "/tolliwoodhero-prabhas-actor-portrait.jpg",
  },
  {
    id: "mahesh-babu",
    name: "Tollywood Hero Mahesh Babu",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "jr-ntr",
    name: "Tollywood Hero Jr NTR",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "ram-charan",
    name: "Tollywood Hero Ram Charan",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "vijay-deverakonda",
    name: "Tollywood Hero Vijay Deverakonda",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "nani",
    name: "Tollywood Hero Nani",
    imageUrl: "/tolliwoodhero-nani-actor-portrait.jpg",
  },
  {
    id: "chiranjeevi",
    name: "Tollywood Hero Chiranjeevi",
    imageUrl: "/tolliwoodhero-chiranjeevi-actor-portrait.jpg",
  },
  {
    id: "naga-chaitanya",
    name: "Tollywood Hero Naga Chaitanya",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "ravi-teja",
    name: "Tollywood Hero Ravi Teja",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "nithiin",
    name: "Tollywood Hero Nithiin",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "ram-pothineni",
    name: "Tollywood Hero Ram Pothineni",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "sharwanand",
    name: "Tollywood Hero Sharwanand",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "sai-dharam-tej",
    name: "Tollywood Hero Sai Dharam Tej",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "varun-tej",
    name: "Tollywood Hero Varun Tej",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "bellamkonda-sreenivas",
    name: "Tollywood Hero Bellamkonda Sreenivas",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "gopichand",
    name: "Tollywood Hero Gopichand",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "naveen-polishetty",
    name: "Tollywood Hero Naveen Polishetty",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "nikhil-siddharth",
    name: "Tollywood Hero Nikhil Siddharth",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "sudheer-babu",
    name: "Tollywood Hero Sudheer Babu",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "adivi-sesh",
    name: "Tollywood Hero Adivi Sesh",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "vishwak-sen",
    name: "Tollywood Hero Vishwak Sen",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "kartikeya",
    name: "Tollywood Hero Kartikeya Gummakonda",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "santhanam",
    name: "Tollywood Hero Santhanam",
    imageUrl: "/placeholder.svg",
  },

  // CEOs
  {
    id: "satya-nadella",
    name: "CEO Satya Nadella",
    imageUrl: "/MS-Exec-Nadella-Satya-2017-08-31-22_(cropped).jpg",
  },
  {
    id: "sundar-pichai",
    name: "CEO Sundar Pichai",
    imageUrl: "/Sundar_Pichai_-_2023_(cropped).jpg",
  },
  {
    id: "tim-cook",
    name: "CEO Tim Cook",
    imageUrl: "/placeholder.svg",
  },
]

// Helper function to add a new celebrity
export function addCelebrity(name: string, imageUrl: string): Celebrity {
  const id = name.toLowerCase().replace(/\s+/g, "-")
  return { id, name, imageUrl }
}
