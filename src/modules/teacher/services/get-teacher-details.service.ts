// get-teacher-details.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';

@Injectable()
export class GetTeacherDetailsService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async findBySlug(slug: string) {
        const teacher = await this.teacherModel
            .findOne({ slug, isActive: true })
            .select('-__v')
            .lean()
            .exec();

        if (!teacher) {
            throw new NotFoundException(`Teacher with slug "${slug}" not found`);
        }

        return {
            teacherId: teacher._id.toString(),
            fullName: teacher.fullName,
            slug: teacher.slug,
            designation: teacher.designation,
            department: teacher.department,
            shortBio: teacher.shortBio,
            biography: teacher.biography,
            profileImage: teacher.profileImage,
            coverImage: teacher.coverImage,
            email: teacher.showContact ? teacher.email : undefined,
            phone: teacher.showContact ? teacher.phone : undefined,
            officeAddress: teacher.showContact ? teacher.officeAddress : undefined,
            officeHours: teacher.showContact ? teacher.officeHours : undefined,
            academicRank: teacher.academicRank,
            educationHistory: teacher.educationHistory,
            specialization: teacher.specialization,
            researchInterests: teacher.researchInterests,
            yearsOfExperience: teacher.yearsOfExperience,
            achievements: teacher.achievements,
            awards: teacher.awards,
            certifications: teacher.certifications,
            publications: teacher.publications,
            memberships: teacher.memberships,
            currentCourses: teacher.currentCourses,
            previousCourses: teacher.previousCourses,
            expertise: teacher.expertise,
            socialLinks: teacher.showSocialLinks ? teacher.socialLinks : undefined,
            featured: teacher.featured,
            isFounder: teacher.isFounder,
            isLeadInstructor: teacher.isLeadInstructor,
            seo: teacher.seo,
        };
    }

    async findByIdAdmin(teacherId: string) {
        const teacher = await this.teacherModel
            .findById(teacherId)
            .select('-__v')
            .lean()
            .exec();

        if (!teacher) {
            throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
        }

        return {
            teacherId: teacher._id.toString(),
            fullName: teacher.fullName,
            slug: teacher.slug,
            designation: teacher.designation,
            department: teacher.department,
            shortBio: teacher.shortBio,
            biography: teacher.biography,
            profileImage: teacher.profileImage,
            coverImage: teacher.coverImage,
            email: teacher.email,
            phone: teacher.phone,
            officeAddress: teacher.officeAddress,
            officeHours: teacher.officeHours,
            academicRank: teacher.academicRank,
            educationHistory: teacher.educationHistory,
            specialization: teacher.specialization,
            researchInterests: teacher.researchInterests,
            yearsOfExperience: teacher.yearsOfExperience,
            achievements: teacher.achievements,
            awards: teacher.awards,
            certifications: teacher.certifications,
            publications: teacher.publications,
            memberships: teacher.memberships,
            currentCourses: teacher.currentCourses,
            previousCourses: teacher.previousCourses,
            expertise: teacher.expertise,
            instructorPriority: teacher.instructorPriority,
            socialLinks: teacher.socialLinks,
            featured: teacher.featured,
            isActive: teacher.isActive,
            displayOrder: teacher.displayOrder,
            isFounder: teacher.isFounder,
            isLeadInstructor: teacher.isLeadInstructor,
            showOnHomepage: teacher.showOnHomepage,
            showContact: teacher.showContact,
            showSocialLinks: teacher.showSocialLinks,
            seo: teacher.seo,
            createdAt: teacher.createdAt,
            updatedAt: teacher.updatedAt,
        };
    }
}
