// src/constants/trainingsData.ts

export interface TrainingCourse {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Tech" | "Cybersecurity" | "AI" | "E-Commerce" | "Code" | "Communications" | "Web" | "Digital" | "Data Science";
  description: string;
  imageUrl: string;
  isCertification: boolean;
  enrollmentLink?: string;
  price?: string;
}

export const trainingsData: TrainingCourse[] = [
  {
    id: "course-1",
    title: "Cyber Security",
    instructor: "Security Expert",
    duration: "8 weeks • 5 hrs/week",
    level: "Intermediate",
    category: "Cybersecurity",
    description:
      "Learn cybersecurity fundamentals including threat detection, risk assessment, and security protocols.",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 36,000",
  },
  {
    id: "course-2",
    title: "Ethical Hacking",
    instructor: "White Hat Expert",
    duration: "10 weeks • 6 hrs/week",
    level: "Advanced",
    category: "Cybersecurity",
    description:
      "Master penetration testing, vulnerability scanning, and ethical hacking techniques.",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 28,000",
  },
  {
    id: "course-3",
    title: "Digital Forensics",
    instructor: "Forensics Specialist",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Cybersecurity",
    description:
      "Investigate cyber crimes, recover deleted data, and analyze digital evidence.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 28,000",
  },
  {
    id: "course-4",
    title: "Networking",
    instructor: "Network Engineer",
    duration: "8 weeks • 5 hrs/week",
    level: "Beginner",
    category: "Cybersecurity",
    description:
      "Learn networking fundamentals including TCP/IP, routing, switching, and firewalls.",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 28,000",
  },
  {
    id: "course-5",
    title: "AI Automation",
    instructor: "AI Research Lead",
    duration: "8 weeks • 5 hrs/week",
    level: "Advanced",
    category: "AI",
    description:
      "Learn workflow automation, AI integrations, and intelligent automation systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 34,000",
  },
  {
    id: "course-6",
    title: "Machine Learning",
    instructor: "ML Engineer",
    duration: "10 weeks • 6 hrs/week",
    level: "Intermediate",
    category: "AI",
    description:
      "Master machine learning algorithms, data preprocessing, and model building.",
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 29,000",
  },
  {
    id: "course-7",
    title: "Generative AI",
    instructor: "AI Specialist",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "AI",
    description:
      "Learn prompt engineering and AI workflows using modern generative AI tools.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 28,000",
  },
  {
    id: "course-8",
    title: "AI Agents",
    instructor: "AI Engineer",
    duration: "6 weeks • 4 hrs/week",
    level: "Intermediate",
    category: "AI",
    description:
      "Build and deploy autonomous AI agents with APIs, tools, and workflows.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 26,000",
  },
  {
    id: "course-9",
    title: "HR",
    instructor: "HR Specialist",
    duration: "8 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Communications",
    description:
      "Learn HR fundamentals including recruitment, employee management, and workplace ethics.",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 50,000",
  },
  {
    id: "course-10",
    title: "Communication Skills",
    instructor: "Communication Coach",
    duration: "6 weeks • 3 hrs/week",
    level: "Beginner",
    category: "Communications",
    description:
      "Improve spoken communication, presentations, confidence, and professional interaction.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 35,000",
  },
  {
    id: "course-11",
    title: "Digital Marketing",
    instructor: "Marketing Strategist",
    duration: "8 weeks • 5 hrs/week",
    level: "Beginner",
    category: "Digital",
    description:
      "Master SEO, social media marketing, Google Ads, and digital growth strategies.",
    imageUrl:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 79,999",
  },
  {
    id: "course-12",
    title: "Brand Engineering",
    instructor: "Brand Consultant",
    duration: "6 weeks • 4 hrs/week",
    level: "Intermediate",
    category: "Digital",
    description:
      "Learn brand identity, positioning, storytelling, and brand strategy development.",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 30,000",
  },
  {
    id: "course-13",
    title: "Graphic Designing",
    instructor: "Creative Designer",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Digital",
    description:
      "Learn Photoshop, Illustrator, branding, typography, and visual design principles.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321310764-8d2b2f6d7f40?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 28,000",
  },
  {
    id: "course-14",
    title: "App Development",
    instructor: "Senior Mobile Developer",
    duration: "10 weeks • 6 hrs/week",
    level: "Intermediate",
    category: "Web",
    description:
      "Build Android and iOS apps using modern mobile app development frameworks.",
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 45,000",
  },
  {
    id: "course-15",
    title: "Web Development",
    instructor: "Senior Developer",
    duration: "12 weeks • 7 hrs/week",
    level: "Beginner",
    category: "Web",
    description:
      "Learn HTML, CSS, JavaScript, React, Node.js, and full-stack web development.",
    imageUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 40,000",
  },
  {
    id: "course-16",
    title: "C++, OOP & Go Lang",
    instructor: "Software Engineering Expert",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Code",
    description:
      "Learn C++, object-oriented programming concepts, and Go language fundamentals.",
    imageUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 35,000",
  },
  {
    id: "course-17",
    title: "Duolingo",
    instructor: "Language Expert",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Communications",
    description:
      "Prepare for the Duolingo English Test with practice sessions and mock exams.",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 35,000",
  },
  {
    id: "course-18",
    title: "IELTS",
    instructor: "Language Expert",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Communications",
    description:
      "Complete IELTS preparation for Speaking, Writing, Reading, and Listening.",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 29,999",
  },
  {
    id: "course-19",
    title: "PTE",
    instructor: "Language Expert",
    duration: "6 weeks • 4 hrs/week",
    level: "Beginner",
    category: "Communications",
    description:
      "Master the PTE exam format with expert guidance and mock tests.",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format",
    isCertification: true,
    enrollmentLink: "#enroll",
    price: "PKR 27,999",
  },
];
