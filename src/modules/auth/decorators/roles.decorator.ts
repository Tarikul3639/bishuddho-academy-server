import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export enum UserRole {
    ADMIN = "admin",
    STUDENT = "student",
}

export const Roles = (
    ...roles: UserRole[]
) => SetMetadata(
    ROLES_KEY,
    roles,
);