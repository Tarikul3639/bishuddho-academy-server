// src/seeds/data/course.data.ts

import { CourseStatus } from "../../database/schemas/course.schema";

export const COURSE_COLLECTIONS = [
  {
    title: "Complete MERN Stack Development",
    tagline: "Become a full-stack developer from scratch",
    description:
      "Learn MongoDB, Express, React and Node.js by building real-world projects.",
    thumbnailUrl: "/uploads/courses/thumbnails/mern.jpg",
    instructor: "Tarikul Islam",
    startDate: new Date("2026-07-01"),
    schedule: "Fri & Sat, 8:00 PM",
    location: "Online",
    duration: "4 Months",
    totalSeats: 50,
    price: 4500,
    originalPrice: 6000,
    status: CourseStatus.ACTIVE,
    averageRating: 4.8,
    reviewCount: 145,
    includes: [
      "Live Classes",
      "Recorded Videos",
      "Certificate",
      "Projects",
    ],
    modules: [
      {
        title: "HTML & CSS Fundamentals",
        classes: [
          {
            title: "HTML Document Structure",
            session: "Session 1",
          },
          {
            title: "CSS Basics & Box Model",
            session: "Session 2",
          },
          {
            title: "Flexbox & Grid",
            session: "Session 3",
          },
        ],
      },
      {
        title: "JavaScript Essentials",
        classes: [
          {
            title: "Variables & Data Types",
            session: "Session 4",
          },
          {
            title: "Functions & Scope",
            session: "Session 5",
          },
          {
            title: "DOM Manipulation",
            session: "Session 6",
          },
        ],
      },
      {
        title: "React Development",
        classes: [
          {
            title: "React Fundamentals",
            session: "Session 7",
          },
          {
            title: "Hooks & State",
            session: "Session 8",
          },
          {
            title: "API Integration",
            session: "Session 9",
          },
        ],
      },
      {
        title: "Backend Development",
        classes: [
          {
            title: "Express.js Basics",
            session: "Session 10",
          },
          {
            title: "MongoDB CRUD",
            session: "Session 11",
          },
          {
            title: "Authentication with JWT",
            session: "Session 12",
          },
        ],
      },
    ],
  },

  {
    title: "Advanced Next.js & TypeScript",
    tagline: "Build production-grade applications",
    description:
      "Master Next.js App Router, TypeScript and scalable architecture.",
    thumbnailUrl: "/uploads/courses/thumbnails/nextjs.jpg",
    instructor: "Nayeem Hossain",
    startDate: new Date("2026-08-10"),
    schedule: "Tue & Thu, 9:00 PM",
    location: "Online",
    duration: "3 Months",
    totalSeats: 40,
    price: 5000,
    originalPrice: 6500,
    status: CourseStatus.UPCOMING,
    averageRating: 4.9,
    reviewCount: 89,
    includes: ["Live Classes", "Certificate", "Projects"],
    modules: [
      {
        title: "TypeScript Deep Dive",
        classes: [
          {
            title: "Type System",
            session: "Session 1",
          },
          {
            title: "Generics",
            session: "Session 2",
          },
          {
            title: "Advanced Types",
            session: "Session 3",
          },
        ],
      },
      {
        title: "Next.js Core",
        classes: [
          {
            title: "App Router",
            session: "Session 4",
          },
          {
            title: "Layouts & Pages",
            session: "Session 5",
          },
          {
            title: "Server Components",
            session: "Session 6",
          },
        ],
      },
      {
        title: "Production Architecture",
        classes: [
          {
            title: "Authentication",
            session: "Session 7",
          },
          {
            title: "Caching",
            session: "Session 8",
          },
          {
            title: "Deployment",
            session: "Session 9",
          },
        ],
      },
    ],
  },

  {
    title: "UI/UX Design Masterclass",
    tagline: "Design beautiful user experiences",
    description:
      "Learn Figma, wireframing, prototyping and design systems.",
    thumbnailUrl: "/uploads/courses/thumbnails/uiux.jpg",
    instructor: "Sarah Ahmed",
    startDate: new Date("2026-07-15"),
    schedule: "Mon & Wed, 7:00 PM",
    location: "Online",
    duration: "2 Months",
    totalSeats: 35,
    price: 3500,
    originalPrice: 4500,
    status: CourseStatus.ACTIVE,
    averageRating: 4.7,
    reviewCount: 67,
    includes: ["Figma Files", "Assignments", "Certificate"],
    modules: [
      {
        title: "Design Basics",
        classes: [
          {
            title: "Color Theory",
            session: "Session 1",
          },
          {
            title: "Typography",
            session: "Session 2",
          },
        ],
      },
      {
        title: "Figma Workflow",
        classes: [
          {
            title: "Wireframing",
            session: "Session 3",
          },
          {
            title: "Components",
            session: "Session 4",
          },
          {
            title: "Auto Layout",
            session: "Session 5",
          },
        ],
      },
      {
        title: "Prototype & Testing",
        classes: [
          {
            title: "Interactive Prototype",
            session: "Session 6",
          },
          {
            title: "Usability Testing",
            session: "Session 7",
          },
        ],
      },
    ],
  },

  {
    title: "Python for Data Science",
    tagline: "Analyze data like a professional",
    description:
      "Learn NumPy, Pandas, Matplotlib and real-world data analysis.",
    thumbnailUrl: "/uploads/courses/thumbnails/python-ds.jpg",
    instructor: "Arif Rahman",
    startDate: new Date("2026-09-01"),
    schedule: "Fri & Sat, 9:00 PM",
    location: "Online",
    duration: "3 Months",
    totalSeats: 60,
    price: 5500,
    originalPrice: 7000,
    status: CourseStatus.UPCOMING,
    averageRating: 4.6,
    reviewCount: 120,
    includes: ["Datasets", "Projects", "Certificate"],
    modules: [
      {
        title: "Python Basics",
        classes: [
          {
            title: "Variables",
            session: "Session 1",
          },
          {
            title: "Functions",
            session: "Session 2",
          },
        ],
      },
      {
        title: "NumPy & Pandas",
        classes: [
          {
            title: "NumPy Arrays",
            session: "Session 3",
          },
          {
            title: "Pandas DataFrames",
            session: "Session 4",
          },
        ],
      },
      {
        title: "Data Visualization",
        classes: [
          {
            title: "Matplotlib",
            session: "Session 5",
          },
          {
            title: "Seaborn",
            session: "Session 6",
          },
        ],
      },
    ],
  },

  {
    title: "Flutter Mobile App Development",
    tagline: "Build Android & iOS apps",
    description:
      "Learn Flutter, Firebase and state management.",
    thumbnailUrl: "/uploads/courses/thumbnails/flutter.jpg",
    instructor: "Tanvir Ahmed",
    startDate: new Date("2026-08-05"),
    schedule: "Mon & Thu, 8:00 PM",
    location: "Online",
    duration: "4 Months",
    totalSeats: 45,
    price: 4800,
    originalPrice: 6500,
    status: CourseStatus.UPCOMING,
    averageRating: 4.8,
    reviewCount: 73,
    includes: ["Projects", "Source Code", "Certificate"],
    modules: [
      {
        title: "Flutter Basics",
        classes: [
          {
            title: "Widgets",
            session: "Session 1",
          },
          {
            title: "Layouts",
            session: "Session 2",
          },
        ],
      },
      {
        title: "State Management",
        classes: [
          {
            title: "Provider",
            session: "Session 3",
          },
          {
            title: "Riverpod",
            session: "Session 4",
          },
        ],
      },
      {
        title: "Firebase Integration",
        classes: [
          {
            title: "Authentication",
            session: "Session 5",
          },
          {
            title: "Firestore",
            session: "Session 6",
          },
        ],
      },
    ],
  },
];