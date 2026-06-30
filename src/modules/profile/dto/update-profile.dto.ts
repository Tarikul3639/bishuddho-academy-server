import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUrl, Matches } from 'class-validator';

const BD_PHONE_REGEX = /^01\d{9}$/;
const BD_PHONE_MESSAGE = 'Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX).';

export class UpdateProfileDto {
    @ApiPropertyOptional({ description: "User's full name", example: 'Tarikul Islam' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Primary phone number', example: '01712345678' })
    @IsOptional()
    @Matches(BD_PHONE_REGEX, { message: BD_PHONE_MESSAGE })
    phone?: string;

    @ApiPropertyOptional({ description: 'Secondary / alternative phone number', example: '01812345678' })
    @IsOptional()
    @Matches(BD_PHONE_REGEX, { message: BD_PHONE_MESSAGE })
    alternativePhone?: string;

    @ApiPropertyOptional({ description: 'Date of birth in ISO 8601 format', example: '2000-06-15' })
    @IsOptional()
    @IsDateString({}, { message: 'Date of birth must be a valid ISO date string (YYYY-MM-DD).' })
    dateOfBirth?: string;

    @ApiPropertyOptional({ enum: ['Male', 'Female', 'Other', 'Prefer not to say'], example: 'Male' })
    @IsOptional()
    @IsEnum(['Male', 'Female', 'Other', 'Prefer not to say'], { message: 'Invalid gender value.' })
    gender?: string;

    @ApiPropertyOptional({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], example: 'B+' })
    @IsOptional()
    @IsEnum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], { message: 'Invalid blood group.' })
    bloodGroup?: string;

    @ApiPropertyOptional({ enum: ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'], example: 'Islam' })
    @IsOptional()
    @IsEnum(['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'], { message: 'Invalid religion value.' })
    religion?: string;

    @ApiPropertyOptional({ description: "User's nationality", example: 'Bangladeshi' })
    @IsOptional()
    @IsString()
    nationality?: string;

    @ApiPropertyOptional({ description: 'National ID number', example: '1234567890123' })
    @IsOptional()
    @IsString()
    nidNumber?: string;

    @ApiPropertyOptional({ description: 'Birth registration number', example: '20001234567890123' })
    @IsOptional()
    @IsString()
    birthRegistrationNumber?: string;

    @ApiPropertyOptional({ description: 'Passport number (if any)', example: 'AB1234567' })
    @IsOptional()
    @IsString()
    passportNumber?: string;

    @ApiPropertyOptional({ description: 'Academic roll number', example: '2021331039' })
    @IsOptional()
    @IsString()
    rollNumber?: string;

    @ApiPropertyOptional({ description: 'University registration number', example: '2021331039' })
    @IsOptional()
    @IsString()
    registrationNumber?: string;

    @ApiPropertyOptional({ description: 'Academic session', example: '2021-22' })
    @IsOptional()
    @IsString()
    session?: string;

    @ApiPropertyOptional({ description: 'Department name', example: 'Computer Science & Engineering' })
    @IsOptional()
    @IsString()
    department?: string;

    @ApiPropertyOptional({ description: 'Enrolled program', example: 'B.Sc. in CSE' })
    @IsOptional()
    @IsString()
    program?: string;

    @ApiPropertyOptional({ description: 'Current semester', example: '8th' })
    @IsOptional()
    @IsString()
    semester?: string;

    @ApiPropertyOptional({ description: 'Batch / intake number', example: '51' })
    @IsOptional()
    @IsString()
    batch?: string;

    @ApiPropertyOptional({ description: 'Admission date in ISO 8601 format', example: '2021-01-10' })
    @IsOptional()
    @IsDateString({}, { message: 'Admission date must be a valid ISO date string (YYYY-MM-DD).' })
    admissionDate?: string;

    @ApiPropertyOptional({ description: "Father's full name", example: 'Mohammad Islam' })
    @IsOptional()
    @IsString()
    fatherName?: string;

    @ApiPropertyOptional({ description: "Mother's full name", example: 'Fatema Begum' })
    @IsOptional()
    @IsString()
    motherName?: string;

    @ApiPropertyOptional({ description: "Guardian's full name", example: 'Mohammad Islam' })
    @IsOptional()
    @IsString()
    guardianName?: string;

    @ApiPropertyOptional({ description: "Guardian's phone number", example: '01912345678' })
    @IsOptional()
    @Matches(BD_PHONE_REGEX, { message: BD_PHONE_MESSAGE })
    guardianPhone?: string;

    @ApiPropertyOptional({ description: "Guardian's occupation", example: 'Business' })
    @IsOptional()
    @IsString()
    guardianOccupation?: string;

    @ApiPropertyOptional({ description: 'Emergency contact full name', example: 'Mohammad Islam' })
    @IsOptional()
    @IsString()
    emergencyContactName?: string;

    @ApiPropertyOptional({ description: 'Emergency contact phone number', example: '01912345678' })
    @IsOptional()
    @Matches(BD_PHONE_REGEX, { message: BD_PHONE_MESSAGE })
    emergencyContactNumber?: string;

    @ApiPropertyOptional({ enum: ['Father', 'Mother', 'Sibling', 'Spouse', 'Friend', 'Other'], example: 'Father' })
    @IsOptional()
    @IsEnum(['Father', 'Mother', 'Sibling', 'Spouse', 'Friend', 'Other'], { message: 'Invalid relationship value.' })
    relationship?: string;

    @ApiPropertyOptional({ description: 'Current residential address', example: 'House 12, Road 5, Kafrul, Dhaka' })
    @IsOptional()
    @IsString()
    presentAddress?: string;

    @ApiPropertyOptional({ description: 'Permanent home address', example: 'Village: Char Fasson, Bhola, Barisal' })
    @IsOptional()
    @IsString()
    permanentAddress?: string;

    @ApiPropertyOptional({ description: 'Direct URL to the profile avatar image', example: 'https://example.com/avatars/tarikul.jpg' })
    @IsOptional()
    @IsUrl({}, { message: 'Avatar URL must be a valid URL.' })
    avatarUrl?: string;
}
