// src/constants/yunityData.ts

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  icon: string;
  colorClass: string;
  description: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: string;
  externalLink?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-yunity-2026",
    title: "Through the Viewfinder: 48 Hours at YUNIty",
    category: "Summit",
    icon: "fa-camera",
    colorClass: "brand",
    description: "A raw, behind-the-scenes look at the two days of chaos, caffeine, and creative sparks that defined YUNIty, through the eyes of the camera guy.",
    date: "May 18, 2026",
    readTime: "8 min read",
    imageUrl: "/gallery/_DSC2263.jpg",
    author: "Camera Guy",
  },
  {
    id: "gallery-yunity-2026",
    title: "YUNIty 2026: Interactive Memory Cloud",
    category: "Summit",
    icon: "fa-camera",
    colorClass: "brand",
    description: "Launch the high-fidelity interactive gallery of the YUNIty event. Walk through the captured frames of our collective story.",
    date: "May 18, 2026",
    readTime: "Interactive Showcase",
    imageUrl: "/gallery/_DSC2342.jpg",
    author: "Camera Guy",
  },
  {
    id: "blog-7",
    title: "Upcoming Summer Trainings Trailer",
    category: "Summit",
    icon: "fa-rocket",
    colorClass: "brand",
    description: "A first look at the upcoming summer trainings lineup, plus the Open Learning Weekend preview for students and professionals.",
    date: "May 29, 2026",
    readTime: "2 min read",
    imageUrl: "/gallery/_DSC2200.jpg",
    author: "Events Team",
  },
  {
    id: "blog-1",
    title: "NCAT 2026 at NASTP",
    category: "Tech Conference",
    icon: "fa-network-wired",
    colorClass: "brand",
    description: "YUNI is organizing the National Conference of Applied Technology focusing on cybersecurity.",
    date: "March 15, 2026",
    readTime: "5 min read",
    imageUrl: "/gallery/_DSC2431.jpg",
    author: "YUNI Team",
  },
  {
    id: "blog-2",
    title: "Winter Warmth Drive",
    category: "CSR Initiative",
    icon: "fa-hand-holding-heart",
    colorClass: "blue",
    description: "The YUNI community came together to distribute essential winter supplies to roadside communities.",
    date: "January 10, 2026",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&auto=format",
    author: "CSR Team",
  },
  {
    id: "blog-3",
    title: "Cybersecurity Bootcamp Graduation",
    category: "Education",
    icon: "fa-graduation-cap",
    colorClass: "brand",
    description: "First cohort of ethical hacking students complete their training with 100% certification success rate.",
    date: "February 28, 2026",
    readTime: "6 min read",
    imageUrl: "/gallery/_DSC2377.jpg",
    author: "Academics Team",
  },
  {
    id: "blog-4",
    title: "AI in Fintech Summit",
    category: "Industry Event",
    icon: "fa-robot",
    colorClass: "brand",
    description: "Exploring the intersection of artificial intelligence and financial technology in Pakistan.",
    date: "April 2, 2026",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&auto=format",
    author: "Tech Team",
  },
  {
    id: "blog-5",
    title: "Community Iftar Gathering",
    category: "Community",
    icon: "fa-users",
    colorClass: "blue",
    description: "YUNI hosted a massive community iftar bringing together students, mentors, and industry leaders.",
    date: "March 25, 2026",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&auto=format",
    author: "Community Team",
  },
  {
    id: "blog-6",
    title: "Partnership with AWS Educate",
    category: "Partnership",
    icon: "fa-handshake",
    colorClass: "brand",
    description: "YUNI becomes official AWS Educate partner, bringing cloud computing resources to students.",
    date: "February 14, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&auto=format",
    author: "Partnerships Team",
  },
];

export const galleryImages = [
  { id: 'g1', src: "/gallery/_DSC2165.jpg", alt: "Event setup and preparations", size: "md" as const, x: 10, y: 15 },
  { id: 'g2', src: "/gallery/_DSC2172.jpg", alt: "Workshop session in progress", size: "lg" as const, x: 38, y: 10 },
  { id: 'g3', src: "/gallery/_DSC2198.jpg", alt: "Attendees networking", size: "sm" as const, x: 15, y: 55 },
  { id: 'g4', src: "/gallery/_DSC2200.jpg", alt: "Speaker on the main stage", size: "lg" as const, x: 68, y: 15 },
  { id: 'g5', src: "/gallery/_DSC2210.jpg", alt: "Team collaboration moment", size: "md" as const, x: 45, y: 65 },
  { id: 'g6', src: "/gallery/_DSC2219.jpg", alt: "Candid crowd reactions", size: "sm" as const, x: 82, y: 52 },
  { id: 'g7', src: "/gallery/_DSC2227.jpg", alt: "Interactive session highlights", size: "md" as const, x: 28, y: 45 },
  { id: 'g8', src: "/gallery/_DSC2263.jpg", alt: "Behind the scenes crew", size: "sm" as const, x: 65, y: 50 },
  { id: 'g9', src: "/gallery/_DSC2342.jpg", alt: "Group photo and celebrations", size: "lg" as const, x: 42, y: 45 },
  { id: 'g10', src: "/gallery/_DSC2344.jpg", alt: "Audience engagement", size: "md" as const, x: 5, y: 40 },
  { id: 'g11', src: "/gallery/_DSC2377.jpg", alt: "Keynote session energy", size: "sm" as const, x: 75, y: 35 },
  { id: 'g12', src: "/gallery/_DSC2383.jpg", alt: "Post-event wind down", size: "md" as const, x: 55, y: 5 },
  { id: 'g13', src: "/gallery/_DSC2431.jpg", alt: "Team building activities", size: "lg" as const, x: 20, y: 75 },
  { id: 'g14', src: "/gallery/_DSC2432.jpg", alt: "Award ceremony highlights", size: "sm" as const, x: 85, y: 70 },
  { id: 'g15', src: "/gallery/_DSC2447.jpg", alt: "Final group wrap-up", size: "md" as const, x: 60, y: 75 },
  { id: 'g16', src: "/gallery/_DSC2604.jpg", alt: "Closing ceremony", size: "sm" as const, x: 35, y: 35 },
];
