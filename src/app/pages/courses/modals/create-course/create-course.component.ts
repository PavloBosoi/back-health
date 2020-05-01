import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Course, ICourse } from '../../../../core/domain/models/course.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { procedureBreakValidator } from '../../../../shared/validators/procedure-break.validator';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit{
    public createCourseFormGroup: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<CreateCourseComponent>,
        @Inject(MAT_DIALOG_DATA) public modalData: ICourse
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.createCourseFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required])
        });
    }

    public submitForm() {
        this.modalData = new Course(this.createCourseFormGroup.get('name').value);
        this.closeDialog();
    }

    public closeDialog(): void {
        this.dialogRef.close(this.modalData);
    }
}
