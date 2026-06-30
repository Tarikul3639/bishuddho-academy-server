import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
    @ApiProperty({ example: '64f1a2b3c4d5e6f7a8b9c0d1' })
    userId!: string;

    @ApiProperty({ example: 'Tarikul Islam' })
    name!: string;

    @ApiProperty({ example: 'tarikul.dev@nexion.com' })
    email!: string;

    @ApiPropertyOptional({ example: '01712345678' })
    phone?: string;

    @ApiPropertyOptional({ example: '01812345678' })
    alternativePhone?: string;

    @ApiPropertyOptional({ example: '2000-06-15' })
    dateOfBirth?: string;

    @ApiPropertyOptional({ enum: ['Male', 'Female', 'Other', 'Prefer not to say'], example: 'Male' })
    gender?: string;

    @ApiPropertyOptional({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], example: 'B+' })
    bloodGroup?: string;

    @ApiPropertyOptional({ enum: ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'], example: 'Islam' })
    religion?: string;

    @ApiPropertyOptional({ example: 'Bangladeshi' })
    nationality?: string;

    @ApiPropertyOptional({ example: '1234567890123' })
    nidNumber?: string;

    @ApiPropertyOptional({ example: '20001234567890123' })
    birthRegistrationNumber?: string;

    @ApiPropertyOptional({ example: 'AB1234567' })
    passportNumber?: string;

    @ApiPropertyOptional({ example: '2021331039' })
    rollNumber?: string;

    @ApiPropertyOptional({ example: '2021331039' })
    registrationNumber?: string;

    @ApiPropertyOptional({ example: '2021-22' })
    session?: string;

    @ApiPropertyOptional({ example: 'Computer Science & Engineering' })
    department?: string;

    @ApiPropertyOptional({ example: 'B.Sc. in CSE' })
    program?: string;

    @ApiPropertyOptional({ example: '8th' })
    semester?: string;

    @ApiPropertyOptional({ example: '51' })
    batch?: string;

    @ApiPropertyOptional({ example: '2021-01-10' })
    admissionDate?: string;

    @ApiPropertyOptional({ example: 'Mohammad Islam' })
    fatherName?: string;

    @ApiPropertyOptional({ example: 'Fatema Begum' })
    motherName?: string;

    @ApiPropertyOptional({ example: 'Mohammad Islam' })
    guardianName?: string;

    @ApiPropertyOptional({ example: '01912345678' })
    guardianPhone?: string;

    @ApiPropertyOptional({ example: 'Business' })
    guardianOccupation?: string;

    @ApiPropertyOptional({ example: 'Mohammad Islam' })
    emergencyContactName?: string;

    @ApiPropertyOptional({ example: '01912345678' })
    emergencyContactNumber?: string;

    @ApiPropertyOptional({ enum: ['Father', 'Mother', 'Sibling', 'Spouse', 'Friend', 'Other'], example: 'Father' })
    relationship?: string;

    @ApiPropertyOptional({ example: 'House 12, Road 5, Kafrul, Dhaka' })
    presentAddress?: string;

    @ApiPropertyOptional({ example: 'Village: Char Fasson, Bhola, Barisal' })
    permanentAddress?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatars/tarikul.jpg' })
    avatarUrl?: string;

    @ApiPropertyOptional({ example: 3 })
    enrolledCourses?: number;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    createdAt!: string;

    @ApiProperty({ example: 'student' })
    role!: string;

    @ApiProperty({ example: 'active' })
    status!: string;
}
