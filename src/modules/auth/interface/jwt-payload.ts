import { UserRole } from "../decorators/roles.decorator";

export interface JwtPayload {
    userId: string;
    name: string;
    email: string;
    role: UserRole;

    enrolledCourses?: number;
    createdAt: string;
    avatarUrl?: string;
}