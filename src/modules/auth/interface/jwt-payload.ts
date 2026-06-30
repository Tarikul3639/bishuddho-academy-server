import { UserRole } from "../../../database/schemas/user.schema";

export interface JwtPayload {
    userId: string;
    name: string;
    email: string;
    role: UserRole;

    enrolledCourses?: number;
    createdAt: string;
    avatarUrl?: string;
}