import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ICourse } from '../../../../core/domain/icourse';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent {

    constructor(
        public dialogRef: MatDialogRef<CreateCourseComponent>,
        @Inject(MAT_DIALOG_DATA) public modalData: ICourse) {}

    closeDialog(): void {
        this.dialogRef.close();
    }

}
