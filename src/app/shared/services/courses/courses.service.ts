import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';

import { Course, ICourse, ICourseDTO } from '../../../core/domain/models/course.model';
import { environment } from '../../../../environments/environment';
import { ISubCourse, ISubCourseDTO } from '../../../core/domain/isubcourse';
import { TermService } from '../term/term.service';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private readonly DBUrl = `${environment.firebaseDbUrl}`;

    constructor(
        private http: HttpClient,
        private termService: TermService
    ) { }

    public createCourse(course: ICourse): Observable<ICourse> {
        return this.http.post<ICourseDTO>(`${this.DBUrl}/courses.json`, course).pipe(
            map((fbCourseDTO: ICourseDTO) => new Course(course.name, fbCourseDTO.name, course.subCourses)),
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
            map((fbCourseDTO: ICourseDTO) => {
                return new Course(fbCourseDTO.name, id, this.convertSubCoursesArrayFromServer(fbCourseDTO.subCourses));
            }),
            take(1)
        );
    }

    public updateCourse(course: ICourse): Observable<ICourse> {
        return this.http.patch<ICourseDTO>(`${this.DBUrl}/courses/${course.id}.json`, this.addRandomIdToSubCourses(course)).pipe(
            map((fbCourseDTO: ICourseDTO) =>
                new Course(fbCourseDTO.name, fbCourseDTO.id, this.convertSubCoursesArrayFromServer(fbCourseDTO.subCourses))
            ),
            take(1)
        );
    }

    public deleteCourse(course: ICourse): Observable<ICourseDTO> {
        return this.http.delete<ICourseDTO>(`${this.DBUrl}/courses/${course.id}.json`).pipe(
            take(1)
        );
    }

    private convertSubCoursesArrayFromServer(subCourses: ISubCourseDTO[]): ISubCourse[] {
        if (subCourses) {
            return subCourses.map((subCourse: ISubCourseDTO) => this.convertSubCourseFromServer(subCourse));
        }
        return null;
    }

    private convertSubCourseFromServer(subCourse: ISubCourseDTO): ISubCourse {
        const convertedSubCourse: ISubCourse = Object.assign({}, subCourse, {
            id: subCourse.id ? subCourse.id : this.generateRandomId(),
            break: this.termService.createTerm(subCourse.break),
            procedureBreak: this.termService.createTerm(subCourse.procedureBreak),
            procedureCount: this.termService.createTerm(subCourse.procedureCount),
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

    private addRandomIdToSubCourses(course: ICourse): ICourse {
        if (course.subCourses) {
            course.subCourses.map((subCourse: ISubCourse) => Object.assign(subCourse, {
                id: subCourse.id ? subCourse.id : this.generateRandomId()
            }));
        }
        return course;
    }

    private generateRandomId() {
        return UUID.UUID();
    }
}
