import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSummaryDto {
    @ApiProperty()
    id!: string;

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

    @ApiProperty({ enum: ['active', 'blocked'] })
    status!: string;

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
    id!: string;

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

    @ApiProperty({ enum: ['student', 'admin'] })
    role!: string;

    @ApiProperty({ enum: ['active', 'blocked'] })
    status!: string;

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
