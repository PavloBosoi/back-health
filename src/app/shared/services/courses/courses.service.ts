import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Course, ICourse, ICourseDTO } from '../../../core/domain/models/course.model';
import { environment } from '../../../../environments/environment';
import { ISubCourse, ISubCourseDTO } from '../../../core/domain/isubcourse';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private readonly DBUrl = `${environment.firebaseDbUrl}`;

    constructor(private http: HttpClient) { }

    public createCourse(course: ICourse): Observable<ICourse> {
        return this.http.post<ICourse>(`${this.DBUrl}/courses.json`, course).pipe(
            map((fbCourseDTO: ICourse) => new Course(course.name, fbCourseDTO.name, course.subCourses)),
            take(1)
        );
    }

    public getCourses(): Observable<ICourse[]> {
        return this.http.get<ICourseDTO[]>(`${this.DBUrl}/courses.json`).pipe(
            map((result: {[key: string]: any}) => {
                if (result) {
                    return Object.keys(result).map((key: string) => {
                        return new Course(result[key].name, key, this.convertSubCoursesArrayFromServer(result[key].subCourses));
                    });
                }
                return [];
            }),
            take(1)
        );
    }

    public getCourseById(id: string): Observable<ICourse> {
        return this.http.get<ICourseDTO>(`${this.DBUrl}/courses/${id}.json`).pipe(
            map((course: ICourseDTO) => {
                return new Course(course.name, id, this.convertSubCoursesArrayFromServer(course.subCourses));
            }),
            take(1)
        );
    }

    public updateCourse(course: ICourse): Observable<ICourseDTO> {
        return this.http.patch<ICourseDTO>(`${this.DBUrl}/courses/${course.id}.json`, course).pipe(
            take(1)
        );
    }

    private convertSubCoursesArrayFromServer(subCourses: ISubCourseDTO[]): ISubCourse[] {
        return subCourses.map((subCourse: ISubCourseDTO) => this.convertSubCourseFromServer(subCourse));
    }

    private convertSubCourseFromServer(subCourse: ISubCourseDTO): ISubCourse {
        const convertedSubCourse: ISubCourse = Object.assign({}, subCourse, {
            startDate: new Date(subCourse.startDate),
            endDate: new Date(subCourse.endDate),
            dates: this.stringsArrayToDateArray(subCourse.dates),
            completedDates: this.stringsArrayToDateArray(subCourse.completedDates),
        });
        return convertedSubCourse;
    }

    private stringsArrayToDateArray(stringDates: string[]): Date[] {
        return stringDates ? stringDates.map((stringDate: string) => new Date(stringDate)) : [];
    }
}
