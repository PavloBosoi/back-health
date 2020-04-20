import { ISubCourse } from './isubcourse';

export interface ICourse {
    id?: string;
    name: string;
    subCourses: ISubCourse[];
}
