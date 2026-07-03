export interface IDashboardCourse {
    courseId: string;

    title: string;

    instructor: string;

    schedule: string;

    location: string;

    duration: string;

    status: string;

    totalSeats: number;

    bookedSeats: number;

    lessons: number;

    revenue: number;

    startDate: Date;
}