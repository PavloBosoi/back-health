import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateCourseComponent } from './modals/create-course/create-course.component';
import { ICourse } from '../../core/domain/models/course.model';
import { CoursesService } from '../../shared/services/courses/courses.service';
import { ROUTES_SLASHED } from '../../routes.constants';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
    public readonly ROUTES_SLASHED = ROUTES_SLASHED;
    public courses: ICourse[] = [];
    private courseName: string;

    constructor(
        public dialog: MatDialog,
        private coursesService: CoursesService
    ) { }

    ngOnInit(): void {
        this.setCourses();
    }
    private setCourses() {
        this.coursesService.getCourses().subscribe(
            (courses: ICourse[]) => this.courses = courses
        );
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(CreateCourseComponent, {
            panelClass: 'modal-create-course',
            data: {name: this.courseName}
        });

        dialogRef.afterClosed().subscribe((modalData: ICourse) => {
            this.coursesService.createCourse(modalData).subscribe(
                (course: ICourse) => this.courses.push(course)
            );
        });
    }

}
