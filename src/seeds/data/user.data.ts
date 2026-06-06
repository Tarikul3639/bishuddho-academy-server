// src/seeds/data/user.data.ts

export const USER_COLLECTIONS = [
    {
        name: "System Admin",
        email: "admin@example.com",
        password: "password123", 
        role: "admin",
        status: "active",
        avatar: "https://ui-avatars.com/api/?name=System+Admin&background=0D8ABC&color=fff",
    },
    {
        name: "Tarikul Islam",
        email: "tarikul@example.com",
        password: "password123",
        role: "student",
        status: "active",
        avatar: "https://ui-avatars.com/api/?name=Tarikul+Islam&background=random",
        studentId: "BA-2026-0001",
    },
    {
        name: "Nayeem Hossain",
        email: "nayeem@example.com",
        password: "password123",
        role: "student",
        status: "active",
        avatar: "https://ui-avatars.com/api/?name=Nayeem+Hossain&background=random",
        studentId: "BA-2026-0002",
    },
    {
        name: "Sarah Ahmed",
        email: "sarah@example.com",
        password: "password123",
        role: "student",
        status: "active",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Ahmed&background=random",
        studentId: "BA-2026-0003",
    },
    {
        name: "Suspended Student",
        email: "blocked@example.com",
        password: "password123",
        role: "student",
        status: "blocked",
        avatar: "https://ui-avatars.com/api/?name=Suspended+Student&background=ef4444&color=fff",
        studentId: "BA-2026-0004",
    },
];