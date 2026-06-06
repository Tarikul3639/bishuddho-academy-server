// src/seeds/seed.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";

import { Course } from "../database/schemas/course.schema";
import { Otp } from "../database/schemas/otp.schema";
import { User } from "../database/schemas/user.schema";
import {
    Enrollment,
    EnrollmentStatus,
    PaymentMethod,
    PaymentStatus,
} from "../database/schemas/enrollment.schema";

import { COURSE_COLLECTIONS } from "./data/course.data";
import { USER_COLLECTIONS } from "./data/user.data";

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        @InjectModel(Otp.name)
        private readonly otpModel: Model<Otp>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
    ) {}

    async seed() {
        console.log("🌱 Starting database seeding...");

        /* ─────────────────────────────
           1. Clear Database
        ───────────────────────────── */
        await Promise.all([
            this.userModel.deleteMany({}),
            this.otpModel.deleteMany({}),
            this.courseModel.deleteMany({}),
            this.enrollmentModel.deleteMany({}),
        ]);

        console.log("🗑 Existing data cleared");

        /* ─────────────────────────────
           2. Insert Users
        ───────────────────────────── */
        const usersWithHashedPasswords = await Promise.all(
            USER_COLLECTIONS.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
            })),
        );

        const insertedUsers = await this.userModel.insertMany(usersWithHashedPasswords);
        console.log(`✅ Inserted ${insertedUsers.length} Users`);

        /* ─────────────────────────────
           3. Insert Courses
        ───────────────────────────── */
        const insertedCourses = await this.courseModel.insertMany(COURSE_COLLECTIONS);
        console.log(`✅ Inserted ${insertedCourses.length} Courses`);

        /* ─────────────────────────────
           4. Insert Enrollments
        ───────────────────────────── */
        let totalEnrollments = 0;

        // Filter out only the students
        const students = insertedUsers.filter((user) => user.role === "student");

        if (students.length >= 3 && insertedCourses.length >= 3) {
            const enrollmentsData = [
                // Student 1 - Course 1 (Active - Bkash)
                {
                    userId: students[0]._id,
                    courseId: insertedCourses[0]._id,
                    currentSession: 3,
                    status: EnrollmentStatus.ACTIVE,
                    paymentSummary: {
                        method: PaymentMethod.BKASH,
                        trxId: "TXN987654321BK",
                        amount: insertedCourses[0].price,
                        paidAt: new Date().toISOString(),
                        status: PaymentStatus.VERIFIED,
                    },
                },
                // Student 2 - Course 1 (Pending - Nagad)
                {
                    userId: students[1]._id,
                    courseId: insertedCourses[0]._id,
                    currentSession: 0,
                    status: EnrollmentStatus.PENDING,
                    paymentSummary: {
                        method: PaymentMethod.NAGAD,
                        trxId: "TXN123456789NG",
                        amount: insertedCourses[0].price,
                        paidAt: new Date().toISOString(),
                        status: PaymentStatus.PENDING,
                    },
                },
                // Student 3 - Course 2 (Active - Cash)
                {
                    userId: students[2]._id,
                    courseId: insertedCourses[1]._id,
                    currentSession: 1,
                    status: EnrollmentStatus.ACTIVE,
                    paymentSummary: {
                        method: PaymentMethod.CASH,
                        amount: insertedCourses[1].price,
                        paidAt: new Date().toISOString(),
                        status: PaymentStatus.VERIFIED,
                    },
                },
                // Student 1 - Course 3 (Active - Bkash) -> Same student in multiple courses
                {
                    userId: students[0]._id,
                    courseId: insertedCourses[2]._id,
                    currentSession: 0,
                    status: EnrollmentStatus.ACTIVE,
                    paymentSummary: {
                        method: PaymentMethod.BKASH,
                        trxId: "TXN456789123BK",
                        amount: insertedCourses[2].price,
                        paidAt: new Date().toISOString(),
                        status: PaymentStatus.VERIFIED,
                    },
                },
            ];

            const insertedEnrollments = await this.enrollmentModel.insertMany(enrollmentsData);
            totalEnrollments = insertedEnrollments.length;
            console.log(`✅ Inserted ${totalEnrollments} Enrollments`);
        }

        console.log("✅ Database seeding completed successfully!");

        return {
            success: true,
            totalUsers: insertedUsers.length,
            totalCourses: insertedCourses.length,
            totalEnrollments: totalEnrollments,
        };
    }
}