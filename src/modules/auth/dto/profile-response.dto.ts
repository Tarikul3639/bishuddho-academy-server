// src/users/dto/profile-response.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
    // ─── PERSONAL INFO ───────────────────────────────────────────────────────

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

    // ─── IDENTITY DOCUMENTS ──────────────────────────────────────────────────

    @ApiPropertyOptional({ example: '1234567890123' })
    nidNumber?: string;

    @ApiPropertyOptional({ example: '20001234567890123' })
    birthRegistrationNumber?: string;

    @ApiPropertyOptional({ example: 'AB1234567' })
    passportNumber?: string;

    // ─── FAMILY & GUARDIAN ───────────────────────────────────────────────────

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

    // ─── EMERGENCY CONTACT ───────────────────────────────────────────────────

    @ApiPropertyOptional({ example: 'Mohammad Islam' })
    emergencyContactName?: string;

    @ApiPropertyOptional({ example: '01912345678' })
    emergencyContactNumber?: string;

    @ApiPropertyOptional({ enum: ['Father', 'Mother', 'Sibling', 'Spouse', 'Friend', 'Other'], example: 'Father' })
    relationship?: string;

    // ─── ADDRESS ─────────────────────────────────────────────────────────────

    @ApiPropertyOptional({ example: 'House 12, Road 5, Kafrul, Dhaka' })
    presentAddress?: string;

    @ApiPropertyOptional({ example: 'Village: Char Fasson, Bhola, Barisal' })
    permanentAddress?: string;

    // ─── AVATAR ──────────────────────────────────────────────────────────────

    @ApiPropertyOptional({ example: 'https://example.com/avatars/tarikul.jpg' })
    avatarUrl?: string;
}