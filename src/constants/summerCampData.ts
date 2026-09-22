// src/constants/summerCampData.ts

export interface SubCategory {
  title: string;
  topics: string[];
  skills: string[];
}

export interface SummerCampCourse {
  id: string;
  title: string;
  price: string;
  priceLabel: string;
  category: string;
  icon: string;
  description: string;
  imageUrl: string;
  subcategories: SubCategory[];
  isModular?: boolean;
  duration: string;
  sessions: string;
  sessionLength: string;
  level: string;
}

export const summerCampCourses: SummerCampCourse[] = [
  {
    id: "sc-ai",
    title: "Artificial Intelligence",
    price: "PKR 14,500",
    priceLabel: "per subcategory",
    category: "AI",
    icon: "fa-robot",
    description: "Learn how modern AI systems work and how AI tools are being used in education, business, freelancing, and industry.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    subcategories: [
      {
        title: "Generative AI",
        topics: ["AI fundamentals", "ChatGPT, Gemini & Claude", "Prompt Engineering", "AI Content Creation", "AI Productivity Systems"],
        skills: ["Create effective prompts", "Generate professional content", "Improve productivity using AI tools", "Use AI for learning and research"],
      },
      {
        title: "AI Automation",
        topics: ["Workflow automation", "AI-powered business processes", "Make.com & n8n", "AI integrations", "Automation design"],
        skills: ["Build automation workflows", "Connect multiple applications", "Reduce repetitive tasks", "Create no-code AI solutions"],
      },
      {
        title: "Machine Learning",
        topics: ["Machine Learning concepts", "Data collection and preparation", "Data visualization", "AI-powered decision making", "Career pathways in AI"],
        skills: ["Understand ML concepts", "Analyze datasets", "Create visual dashboards", "Develop beginner AI projects"],
      },
    ],
  },
  {
    id: "sc-cyber",
    title: "Cybersecurity",
    price: "PKR 14,500",
    priceLabel: "per subcategory",
    category: "Cybersecurity",
    icon: "fa-shield-halved",
    description: "Learn how cyber threats work and how organizations protect systems and data through ethical hacking, network security, and digital forensics.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    subcategories: [
      {
        title: "Cybersecurity Fundamentals",
        topics: ["Cybersecurity basics", "Digital safety", "Cyber threats", "Malware & phishing", "Security best practices"],
        skills: ["Identify cyber threats", "Secure online accounts", "Apply cyber hygiene practices", "Improve digital safety awareness"],
      },
      {
        title: "Ethical Hacking & Network Security",
        topics: ["Ethical hacking methodology", "Kali Linux basics", "Reconnaissance", "Vulnerability assessment", "Network security fundamentals"],
        skills: ["Perform basic security testing", "Analyze network traffic", "Conduct vulnerability scans", "Understand penetration testing workflows"],
      },
      {
        title: "Digital Forensics",
        topics: ["Digital investigations", "Evidence collection", "Log analysis", "Cybersecurity reporting"],
        skills: ["Analyze digital evidence", "Investigate security incidents", "Document findings professionally", "Understand forensic workflows"],
      },
    ],
  },
  {
    id: "sc-english",
    title: "English Language Excellence",
    price: "PKR 12,999",
    priceLabel: "per subcategory",
    category: "English",
    icon: "fa-language",
    description: "Develop confidence in speaking, writing, reading, and presenting through communication, academic English, IELTS preparation, and professional workplace communication.",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    subcategories: [
      {
        title: "Spoken English & Communication",
        topics: ["Everyday communication", "Pronunciation and fluency", "Public speaking", "Group discussions", "Confidence building"],
        skills: ["Speak confidently in English", "Improve fluency and pronunciation", "Participate in discussions", "Deliver presentations effectively"],
      },
      {
        title: "IELTS Academic Writing & Reading",
        topics: ["IELTS Reading strategies", "Academic vocabulary", "Task 1 Writing", "Task 2 Essay Writing", "Time management techniques"],
        skills: ["Improve reading comprehension", "Write structured academic essays", "Analyze graphs and charts", "Build IELTS exam readiness"],
      },
      {
        title: "Professional English",
        topics: ["Business communication", "Professional email writing", "CV development", "LinkedIn optimization", "Interview preparation"],
        skills: ["Write professional emails", "Create a strong CV", "Improve interview performance", "Build professional communication skills"],
      },
    ],
  },
  {
    id: "sc-dmarketing",
    title: "Digital Marketing",
    price: "PKR 12,999",
    priceLabel: "per subcategory",
    category: "Digital Marketing",
    icon: "fa-bullhorn",
    description: "Learn how businesses use digital platforms to attract customers, build brands, and generate sales.",
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    subcategories: [
      {
        title: "SEO & Content Marketing",
        topics: ["Search Engine Optimization", "Keyword research", "Content strategy", "Blogging", "AI-assisted content creation"],
        skills: ["Optimize content for search engines", "Create marketing content", "Conduct SEO audits", "Build content strategies"],
      },
      {
        title: "Business Development",
        topics: ["Basics of business development", "Client acquisition strategies", "Sales funnels and conversion", "Relationship building & networking", "Market research"],
        skills: ["Identify new business opportunities", "Build and maintain client relationships", "Communicate effectively in sales", "Understand growth strategies"],
      },
      {
        title: "Social Media Marketing",
        topics: ["Content planning", "Instagram marketing", "TikTok marketing", "Brand building", "Social media analytics"],
        skills: ["Manage social media accounts", "Create content calendars", "Grow online communities", "Analyze audience engagement"],
      },
    ],
  },
  {
    id: "sc-webdev",
    title: "Web Development",
    price: "PKR 12,999",
    priceLabel: "per subcategory",
    category: "Web Development",
    icon: "fa-code",
    description: "Learn how websites are designed, developed, and deployed using modern web technologies.",
    imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    subcategories: [
      {
        title: "Front-End Development",
        topics: ["HTML", "CSS", "Responsive Design", "JavaScript Fundamentals"],
        skills: ["Build responsive websites", "Design modern web pages", "Create interactive user experiences"],
      },
      {
        title: "Full-Stack Development",
        topics: ["APIs", "Databases", "Backend concepts", "Deployment"],
        skills: ["Connect websites to databases", "Develop dynamic applications", "Deploy web projects"],
      },
      {
        title: "WordPress & No-Code Development",
        topics: ["WordPress", "Elementor", "Shopify", "Website management"],
        skills: ["Build business websites", "Manage content systems", "Create eCommerce stores"],
      },
    ],
  },
  {
    id: "sc-art",
    title: "Art & Creative Design",
    price: "PKR 12,999",
    priceLabel: "per subcategory",
    category: "Art & Design",
    icon: "fa-palette",
    description: "Designed for students interested in Fine Arts, Design, Architecture, and Art School admissions. Focuses on creativity, portfolio development, and practical artistic skills.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    subcategories: [
      {
        title: "Drawing",
        topics: ["Observation drawing", "Perspective drawing", "Still life studies", "Figure drawing", "Art school entrance preparation"],
        skills: ["Develop drawing fundamentals", "Improve visual observation", "Build an art school portfolio", "Prepare for entrance tests"],
      },
      {
        title: "Painting",
        topics: ["Color theory", "Watercolor techniques", "Acrylic painting", "Composition principles"],
        skills: ["Create original paintings", "Apply color effectively", "Develop artistic techniques"],
      },
      {
        title: "Sculpture & 3D Art",
        topics: ["Clay modeling", "Hand-building techniques", "Texture and form", "Exhibition preparation"],
        skills: ["Create three-dimensional artworks", "Understand spatial design", "Develop creative expression"],
      },
    ],
  },
  {
    id: "sc-softskills",
    title: "7 — Soft Skills & Communication",
    price: "PKR 11,999",
    priceLabel: "per module",
    category: "Soft Skills",
    icon: "fa-lightbulb",
    description: "Build critical thinking, leadership, teamwork, and personal branding through a structured 6-week modular program.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&auto=format",
    duration: "6 Weeks",
    sessions: "3–4 Sessions/Week",
    sessionLength: "1.5 hrs/session",
    level: "Beginner to Intermediate",
    isModular: true,
    subcategories: [
      {
        title: "Critical Thinking & Problem Solving",
        topics: [
          "Design thinking (Empathise–Define–Ideate–Prototype–Test)",
          "Root cause analysis (5 Whys)",
          "Structured decision-making frameworks",
          "Creative problem-solving techniques",
          "Real-world business case studies"
        ],
        skills: [
          "Analyze problems systematically",
          "Identify root causes and propose effective solutions",
          "Apply design thinking to real-world challenges",
          "Make informed decisions using structured frameworks",
          "Present solutions confidently to peers"
        ],
      },
      {
        title: "Leadership & Teamwork",
        topics: [
          "Team roles and dynamics",
          "Leadership styles",
          "Conflict resolution strategies",
          "Giving and receiving feedback",
          "Cross-functional collaboration",
          "Delegation and peer mentoring"
        ],
        skills: [
          "Lead teams effectively toward shared goals",
          "Collaborate productively with diverse team members",
          "Resolve conflicts professionally",
          "Delegate tasks and manage responsibilities",
          "Provide constructive feedback and mentorship"
        ],
      },
      {
        title: "Personal Branding",
        topics: [
          "Personal branding",
          "Identifying strengths",
          "LinkedIn optimization",
          "Portfolio creation",
          "Digital presence",
          "Professional networking",
          "Personal communication",
          "Content creation"
        ],
        skills: [
          "Build a strong personal brand",
          "Create a professional LinkedIn profile",
          "Develop a compelling portfolio",
          "Improve professional communication",
          "Grow a professional network",
          "Strengthen online visibility",
          "Present yourself confidently"
        ],
      },
    ],
  },
];

export const summerCampOutcomes = [
  "Develop practical skills in their chosen field",
  "Complete portfolio-ready projects",
  "Participate in competitions and showcase events",
  "Receive certification upon successful completion",
  "Explore career and academic pathways",
  "Prepare for advanced YUNI training programs",
  "Build confidence, creativity, and professional readiness",
];
