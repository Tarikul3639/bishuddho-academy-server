// src/interfaces/enrollment-with-user.interface.ts

import { Types } from "mongoose";
import { EnrollmentStatus } from "../../../database/schemas/enrollment.schema";

export interface EnrollmentWithUser {
  _id: Types.ObjectId;
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
  courseId: Types.ObjectId;
  currentSession: number;
  status: EnrollmentStatus;
  createdAt: Date;
  updatedAt: Date;
}