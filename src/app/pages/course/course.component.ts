import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TermService } from '../../core/services/term/term.service';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
    public subCourseFormGroup: FormGroup;

    constructor(
        private termService: TermService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.subCourseFormGroup = new FormGroup({
            subCourseName: new FormControl('', [Validators.required]),
            subCourseDuration: this.termService.createTermFormGroup(),
            subCourseBreak: this.termService.createTermFormGroup(),
        });
    }

    public submitForm() {

    }

}
