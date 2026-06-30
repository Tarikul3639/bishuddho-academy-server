import { UserRole } from "../../../database/schemas/user.schema";

export interface JwtPayload {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    status: string;

    enrolledCourses?: number;
    createdAt: string;
    avatarUrl?: string;
}