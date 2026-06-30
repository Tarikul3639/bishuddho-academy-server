import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../../database/schemas/user.schema';

export class UserSummaryDto {
    @ApiProperty()
    userId!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    studentId!: string;

    @ApiProperty()
    joinedDate!: string;

    @ApiProperty()
    lastLogin!: string;

    @ApiProperty({ enum: [UserStatus.ACTIVE, UserStatus.BLOCKED] })
    status!: UserStatus;

    @ApiProperty()
    coursesCount!: number;

    @ApiProperty()
    lastPurchase!: string;
}

export class UserSummaryResponseDto {
    @ApiProperty({ type: [UserSummaryDto] })
    users!: UserSummaryDto[];

    @ApiProperty()
    total!: number;

    @ApiProperty()
    active!: number;

    @ApiProperty()
    blocked!: number;

    @ApiProperty()
    newUsersCount!: number;
}

export class UserDetailDto {
    @ApiProperty()
    userId!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    email!: string;

    @ApiPropertyOptional()
    studentId?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional()
    avatarUrl?: string;

    @ApiProperty({ enum: [UserRole.STUDENT, UserRole.ADMIN] })
    role!: UserRole;

    @ApiProperty({ enum: [UserStatus.ACTIVE, UserStatus.BLOCKED] })
    status!: UserStatus;

    @ApiPropertyOptional()
    joinedDate?: string;

    @ApiPropertyOptional()
    lastLogin?: string;

    @ApiPropertyOptional()
    dateOfBirth?: string;

    @ApiPropertyOptional()
    gender?: string;

    @ApiPropertyOptional()
    bloodGroup?: string;

    @ApiPropertyOptional()
    batch?: string;

    @ApiPropertyOptional()
    department?: string;

    @ApiPropertyOptional()
    program?: string;

    @ApiPropertyOptional()
    semester?: string;

    @ApiPropertyOptional()
    fatherName?: string;

    @ApiPropertyOptional()
    motherName?: string;

    @ApiPropertyOptional()
    guardianName?: string;

    @ApiPropertyOptional()
    guardianPhone?: string;

    @ApiPropertyOptional()
    presentAddress?: string;

    @ApiPropertyOptional()
    permanentAddress?: string;

    @ApiPropertyOptional()
    coursesCount!: number;
}
