export class CourseModuleClass {
  title!: string;
  session!: string;
}

export class CourseModule {
  title!: string;
  classes!: CourseModuleClass[];
}

export class PublicCourseDetailsResponseDto {
  courseId!: string;
  title!: string;
  tagline!: string;
  description!: string;
  thumbnailUrl!: string;
  instructor!: string;
  averageRating!: number;
  reviewCount!: number;
  students!: number;
  price!: number;
  originalPrice!: number;
  discount!: number;
  daysLeft!: number;
  duration!: string;
  lessons!: number;
  totalSeats!: number;
  bookedSeats!: number;
  schedule!: string;
  location!: string;
  startDate!: Date;
  isEnrolled!: boolean;
  includes!: string[];
  modules!: CourseModule[];
}