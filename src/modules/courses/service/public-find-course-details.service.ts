// // service/find-public-course-details.service.ts

// import {
//     Injectable,
//     NotFoundException,
// } from "@nestjs/common";

// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";

// import { Course } from "../../../database/schemas/course.schema";

// import { PublicCourseResponseDto } from "../dto/public-course-response.dto";

// @Injectable()
// export class PublicFindCourseDetailsService {
//     constructor(
//         @InjectModel(Course.name)
//         private courseModel: Model<Course>,
//     ) {}

//     async findById(
//         courseId: string,
//     ): Promise<PublicCourseResponseDto> {

//         const course =
//             await this.courseModel
//                 .findById(courseId)
//                 .lean()
//                 .exec();

//         if (!course) {
//             throw new NotFoundException(
//                 "Course not found",
//             );
//         }

//         return {
//             courseId:
//                 course._id.toString(),

//             title:
//                 course.title,

//             tagline:
//                 course.tagline,

//             description:
//                 course.description,

//             thumbnailUrl:
//                 course.thumbnailUrl,

//             instructor:
//                 course.instructor,

//             startDate:
//                 course.startDate,

//             duration:
//                 course.duration,

//             price:
//                 course.price,

//             originalPrice:
//                 course.originalPrice,

//             lessons:
//                 course.modules?.reduce(
//                     (total, module) =>
//                         total +
//                         (module.classes?.length || 0),
//                     0,
//                 ) || 0,

//             includes:
//                 course.includes || [],

//             status:
//                 course.status,
//         };
//     }
// }