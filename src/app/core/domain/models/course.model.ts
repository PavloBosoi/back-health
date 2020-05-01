import { ISubCourse, ISubCourseDTO } from '../isubcourse';

export interface ICourse {
    name: string;
    id?: string;
    subCourses?: ISubCourse[];
}

export interface ICourseDTO {
    name: string;
    id?: string;
    subCourses?: ISubCourseDTO[];
}

export class Course implements ICourse {
    constructor(
        public name: string,
        public id?: string,
        public subCourses?: ISubCourse[]
    ) {
        this.name = name ? name : null;
        this.id = id ? id : null;
        this.subCourses = subCourses ? subCourses : [];
    }
}

/*this.course = {
    name: course.name ? course.name : null,
    id: course.id ? course.id : null,
    subCourses: course.subCourses ? course.subCourses : []
};*/
