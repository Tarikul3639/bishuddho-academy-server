import { PartialType } from "@nestjs/swagger";

import { AdminCreateCourseDto } from "./admin-create-course.dto";

export class AdminUpdateCourseDto extends PartialType(
    AdminCreateCourseDto,
) { }