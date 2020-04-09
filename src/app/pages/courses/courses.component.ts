import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateCourseComponent } from './modals/create-course/create-course.component';
import { ICourse } from '../../core/domain/icourse';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
    private courseName: string;

    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(CreateCourseComponent, {
            panelClass: 'modal-create-course',
            data: {name: this.courseName}
        });

        dialogRef.afterClosed().subscribe((modalData: ICourse) => {
            console.log('The dialog was closed', modalData);
        });
    }

}
