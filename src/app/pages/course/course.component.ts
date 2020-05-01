import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatCalendar, MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TermService } from '../../shared/services/term/term.service';
import { ISubCourse } from '../../core/domain/isubcourse';
import { TimeType } from '../../core/domain/enumeration/time-type.enum';
import { MONTH_DAYS_COUNT, STRING_EMPTY, WEEK_DAYS_COUNT } from '../../app.constants';
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
        console.log(this.course);
        this.initForm();
        this.updateProcedureBreak();
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
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
        this.setStartDateControl();
        this.setSubCourseToCurrentCourse();
        this.rerenderMainForm();
        this.coursesService.updateCourse(this.course).subscribe((course: any) => {
            console.log(course);
        });
    }

    private setStartDateControl() {
        // if it is the next subcourse we need calculate its startDate(considering the break)
        if (this.course.subCourses.length) {
            const subCourseBreakCountDays: number = this.getTermDaysCount(this.subCourseFormGroup.get('break').value);
            const previousSubCourseEndDate = this.course.subCourses[this.course.subCourses.length - 1].endDate;
            const startDateForCurrentSubCourse = new Date(new Date(previousSubCourseEndDate).setDate(previousSubCourseEndDate.getDate() + subCourseBreakCountDays));
            this.subCourseFormGroup.get('startDate').setValue(startDateForCurrentSubCourse);
        }
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

    private setSubCourseToCurrentCourse() {
        const subCourse: ISubCourse = {
            ...this.subCourseFormGroup.value,
            dates: this.getSubCourseDates(this.subCourseFormGroup.value),
            endDate: this.getSubCourseEndDate(this.subCourseFormGroup.value),
            completedDates: []
        };
        this.course.subCourses.push(subCourse);
    }

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

    public setCompleteDates(event: Date, calendar: MatCalendar<Date>, subCourse: ISubCourse) {
        if (!this.isSameDate(subCourse.completedDates, event)) {
            subCourse.completedDates.push(event);
        } else {
            subCourse.completedDates.splice(this.getDateIndex(subCourse.completedDates, event), 1);
        }
        calendar.updateTodaysDate();
    }

    private isSameDate(dates: Date[], compareDate: Date): boolean {
        return dates.some((date: Date) => date.getTime() === compareDate.getTime());
    }

    private getDateIndex(dates: Date[], searchDate: Date): number {
        return dates.findIndex((date: Date) => date.getTime() === searchDate.getTime());
    }

    public getDateClass(subCourse: ISubCourse): MatCalendarCellCssClasses {
        return (calendarDate: Date): MatCalendarCellCssClasses => {
            const subCourseDatesClass = this.isSameDate(subCourse.dates, calendarDate) ? 'special-date' : STRING_EMPTY;
            const subCourseCompletedDatesClass = this.isSameDate(subCourse.completedDates, calendarDate) ? 'completed-date' : STRING_EMPTY;
            return [subCourseDatesClass, subCourseCompletedDatesClass];
        };
    }

    public getDisabledDates(subCourse: ISubCourse) {
        return (calendarDate: Date): boolean => {
            return this.isSameDate(subCourse.dates, calendarDate);
        };
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

    myFilter = (d: Date): boolean => {
        if (this.course.subCourses.length) {
            for (const subCourse of this.course.subCourses) {
                return !subCourse.dates.some((date: Date) => date.getTime() === d.getTime());
            }
        }
        return true;
    }
}
