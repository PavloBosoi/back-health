import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TermService } from '../../shared/services/term/term.service';
import { ISubCourse } from '../../core/domain/isubcourse';
import { TimeType } from '../../core/domain/enumeration/time-type.enum';
import { MONTH_DAYS_COUNT, WEEK_DAYS_COUNT } from '../../app.constants';
import { ITerm } from '../../core/domain/iterm';
import { procedureBreakValidator } from '../../shared/validators/procedure-break.validator';
import { ICourse } from '../../core/domain/models/course.model';
import { CoursesService } from '../../shared/services/courses/courses.service';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CourseComponent implements OnInit, OnDestroy {
    public subCourseFormGroup: FormGroup;
    public course: ICourse = this.route.snapshot.data['course'];
    public currentSubCourseIndex = null;
    private currentSubCourse: ISubCourse = null;

    public subCourseBreakFormControl: FormGroup;
    public procedureBreakFormControl: FormGroup;
    public procedureBreakValidators: ValidatorFn[];

    private destroyed$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private termService: TermService,
        private coursesService: CoursesService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.setCurrentSubCourseData();
        this.initForm();
        this.updateProcedureBreak();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private setCurrentSubCourseData() {
        // set current index for know what subcourse is creating or editing now
        this.currentSubCourseIndex = this.course.subCourses.length;
        // empty object for ability to assign form values
        this.currentSubCourse = {} as ISubCourse;
    }

    private initForm() {
        this.subCourseFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required]),
            duration: this.termService.createTermFormGroup(),
            procedureCount: this.termService.createTermFormGroup(),
            startDate: new FormControl('', !this.course.subCourses.length ? [Validators.required] : [])
        });

        this.subCourseBreakFormControl = this.termService.createTermFormGroup();
        this.procedureBreakFormControl = this.termService.createTermFormGroup();

        this.subCourseFormGroup.addControl('break', this.subCourseBreakFormControl);
        this.subCourseFormGroup.addControl('procedureBreak', this.procedureBreakFormControl);

        this.procedureBreakValidators = [procedureBreakValidator(this.subCourseFormGroup.get('procedureCount'))];
    }

    private updateProcedureBreak() {
        // update validators on procedureBreakFormControl when procedure count is changed
        this.subCourseFormGroup.get('procedureCount').valueChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            this.procedureBreakFormControl.get('count').updateValueAndValidity();
        });
    }

    public submitForm() {
        if (!this.isEditMode()) {
            // push empty object, but it is linked for next manipulations
            this.course.subCourses.push(this.currentSubCourse);
        }
        Object.assign(this.currentSubCourse, this.subCourseFormGroup.value);
        this.calculateSubCurses(this.currentSubCourseIndex);
/*        if (Object.keys(this.currentSubCourse).length) {
            this.recalculateSubCurses(this.currentSubCourseIndex);

        } else {
            this.setSubCourseToCurrentCourse();
        }*/
        this.rerenderMainForm();
        this.coursesService.updateCourse(this.course).subscribe((course: any) => {
            this.setCurrentSubCourseData();
        });
    }

    private isEditMode(): boolean {
        // check if it is not edit mode, cause currentSubCourse setting only when edit
        return !!Object.keys(this.currentSubCourse).length;
    }

    private calculateSubCurses(calculatedSubCourseIndex: number) {
        // get from current index cause before was deleted a course by id
        const subCoursesForCalculate: ISubCourse[] = this.course.subCourses.slice(calculatedSubCourseIndex);

        for (let i = 0; i < subCoursesForCalculate.length; i++) {
            const currentSubCourse: ISubCourse = this.course.subCourses[calculatedSubCourseIndex + i];
            // previous can be not found if it is the first subcourse
            const previousSubCourse: ISubCourse = this.course.subCourses[calculatedSubCourseIndex - 1 + i] || null;
            console.log(currentSubCourse, previousSubCourse);

            // startDate must be calculated before because getSubCourseDates and getSubCourseEndDate use startDate
            subCoursesForCalculate[i].startDate = this.getStartDate(previousSubCourse, currentSubCourse);
            console.log(this.getStartDate(previousSubCourse, currentSubCourse));

            // get completed date indexes for move them to recalculated dates if exist (order of calculations is important)
            const completedDateIndexes: number[] = this.getCompletedDateIndexes(subCoursesForCalculate[i]);
            subCoursesForCalculate[i].dates = this.getSubCourseDates(subCoursesForCalculate[i]);

            Object.assign(subCoursesForCalculate[i], {
                endDate: this.getSubCourseEndDate(subCoursesForCalculate[i]),
                completedDates: completedDateIndexes ? completedDateIndexes.map(
                    (index: number) => subCoursesForCalculate[i].dates[index]
                ) : []
            });
        }
        // reassign subcourses for rerender calendar dates
        this.course.subCourses = this.course.subCourses.map((subcourse: ISubCourse) => Object.assign({}, subcourse));
    }

    private getCompletedDateIndexes(subCourseForRecalculate: ISubCourse) {
        if (subCourseForRecalculate.completedDates) {
            return subCourseForRecalculate.completedDates.map((completedDate: Date) => {
                return subCourseForRecalculate.dates.findIndex((date: Date) => {
                    return date.getTime() === completedDate.getTime();
                });
            });
        }
        return null;
    }

    private getStartDate(previousSubCourse: ISubCourse, currentSubCourse: ISubCourse) {
        // if it is the next subcourse we need calculate its startDate(considering the break)
        if (this.currentSubCourseIndex > 0) {
            const subCourseBreakCountDays: number = this.getTermDaysCount(currentSubCourse.break);
            const startDateForCurrentSubCourse = new Date(new Date(previousSubCourse.endDate).setDate(previousSubCourse.endDate.getDate() + subCourseBreakCountDays));
            return startDateForCurrentSubCourse;
        }
        return (this.subCourseFormGroup.value as ISubCourse).startDate;
    }

    private getTermDaysCount(term: ITerm): number {
        const termCount: number = +term.count;
        switch (term.type) {
            case TimeType.WEEK:
                return termCount * WEEK_DAYS_COUNT;
            case TimeType.MONTH:
                return termCount * MONTH_DAYS_COUNT;
            default:
                return termCount;
        }
    }

/*    private setSubCourseToCurrentCourse() {
        // startDate must be calculated before because getSubCourseDates and getSubCourseEndDate use startDate
        const subCourse: ISubCourse = {
            ...this.subCourseFormGroup.value,
            startDate: this.getStartDate(this.course.subCourses[this.course.subCourses.length - 1], this.subCourseFormGroup.value)
        };
        Object.assign(subCourse, {
            dates: this.getSubCourseDates(subCourse),
            endDate: this.getSubCourseEndDate(subCourse),
            completedDates: []
        });
        this.course.subCourses.push(subCourse);
    }*/

    private getSubCourseDates(subCourse: ISubCourse) {
        const subCourseProcedureCountType: TimeType = subCourse.procedureCount.type;
        switch (subCourseProcedureCountType) {
            case TimeType.DAY:
                return this.subCourseDatesTypeDay(subCourse);
            case TimeType.WEEK:
                return this.subCourseDatesLongPeriod(subCourse, WEEK_DAYS_COUNT);
            case TimeType.MONTH:
                return this.subCourseDatesLongPeriod(subCourse, MONTH_DAYS_COUNT);
            default:
                console.log('TimeType default');
                return [];
        }
    }

    private subCourseDatesTypeDay(subCourse: ISubCourse): Date[] {
        const subCourseDates: Date[] = [];
        for (let i = 0; i < this.getSubCourseDuration(subCourse.duration); i++) {
            subCourseDates.push(this.getSubCourseDate(subCourse.startDate, i));
        }
        return subCourseDates;
    }

    private subCourseDatesLongPeriod(subCourse: ISubCourse, longPeriodDayCount: number): Date[] {
        const subCourseDates: Date[] = [];
        const subCourseProcedureBreakCountDays: number = this.getTermDaysCount(subCourse.procedureBreak);
        const subCourseProcedureCountDays: number = +subCourse.procedureCount.count;
        let procedureCounter = 0;

        // add 1 day for break correct date
        for (let i = 0; i < this.getSubCourseDuration(subCourse.duration); i += subCourseProcedureBreakCountDays + 1) {
            if (procedureCounter === subCourseProcedureCountDays) {
                // week days - current iteration break - (all procedure days + all break days)
                i += longPeriodDayCount - (subCourseProcedureBreakCountDays + 1) - (subCourseProcedureCountDays + subCourseProcedureBreakCountDays * subCourseProcedureCountDays);
                procedureCounter = 0;
            } else {
                subCourseDates.push(this.getSubCourseDate(subCourse.startDate, i));
                procedureCounter++;
            }
        }
        return subCourseDates;
    }

    private getSubCourseDuration(duration: ITerm) {
        const durationCountDays: number = +duration.count;
        switch (duration.type) {
            case TimeType.DAY:
                return durationCountDays;
            case TimeType.WEEK:
                return durationCountDays * WEEK_DAYS_COUNT;
            case TimeType.MONTH:
                return durationCountDays * MONTH_DAYS_COUNT;
            default:
                return durationCountDays;
        }
    }

    private getSubCourseDate(subCourseStartDate: Date, i: number) {
        const subCoursePeriodDay: number = subCourseStartDate.getDate();
        return new Date(new Date(subCourseStartDate).setDate(subCoursePeriodDay + i));
    }

    private getSubCourseEndDate(subCourse: ISubCourse) {
        const subCourseDurationType: TimeType = subCourse.duration.type;
        switch (subCourseDurationType) {
            case TimeType.DAY:
                return this.getSubCourseEndDateByType(subCourse);
            case TimeType.WEEK:
                return this.getSubCourseEndDateByType(subCourse, WEEK_DAYS_COUNT);
            case TimeType.MONTH:
                return this.getSubCourseEndDateByType(subCourse, MONTH_DAYS_COUNT);
            default:
                console.log('TimeType default');
        }
    }

    private getSubCourseEndDateByType(subCourse: ISubCourse, longPeriodDaysCount?: number): Date {
        const subCourseDurationDays = longPeriodDaysCount ? + (+subCourse.duration.count * longPeriodDaysCount) : +subCourse.duration.count;
        const subCourseStartDate: Date = subCourse.startDate;
        return new Date(new Date(subCourseStartDate).setDate(subCourseStartDate.getDate() + subCourseDurationDays - 1)); // -1 day for include current day to duration
    }

    private rerenderMainForm() {
        if (this.course.subCourses.length) { // rerender form for next subcourses
            this.subCourseFormGroup = null;
            this.changeDetectorRef.detectChanges();

            this.initForm(); // reset main formGroup
        }
    }

    public getTermTypes(countPerPeriod: ITerm) {
        if (countPerPeriod.count > 1) {
            switch (countPerPeriod.type) {
                case TimeType.WEEK:
                    return [TimeType.DAY];
                case TimeType.MONTH:
                    return [TimeType.DAY, TimeType.WEEK];
            }
        }
    }

    public deleteSubCourseById(id: string) {
        const deleteSubCourseIndex = this.course.subCourses.findIndex((subCourse: ISubCourse) => subCourse.id === id);
        this.course.subCourses.splice(deleteSubCourseIndex, 1); // delete subcourse
        // check if exist courses for recalculate, cause deleted course can be the last
        if (deleteSubCourseIndex < this.course.subCourses.length) {
            this.calculateSubCurses(deleteSubCourseIndex);
        }
        this.coursesService.updateCourse(this.course).subscribe();
    }

    public editSubCourseById(id: string) {
        this.currentSubCourse = this.course.subCourses.find((subCourse: ISubCourse) => subCourse.id === id);
        const formKeys: string[] = Object.keys(this.subCourseFormGroup.controls);
        formKeys.forEach((key: string) => {
            this.subCourseFormGroup.get(key).setValue(this.currentSubCourse[key]);
        });
        this.currentSubCourseIndex = this.course.subCourses.findIndex((subCourse: ISubCourse) => subCourse.id === id);
    }

    myFilter = (d: Date): boolean => {
        if (this.course.subCourses.length) {
            for (const subCourse of this.course.subCourses) {
                return !subCourse.dates.some((date: Date) => date.getTime() === d.getTime());
            }
        }
        return true;
    }
}
