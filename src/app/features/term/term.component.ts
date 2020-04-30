import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { TimeType } from '../../core/domain/enumeration/time-type.enum';

@Component({
    selector: 'app-term',
    templateUrl: './term.component.html',
    styleUrls: ['./term.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermComponent implements OnInit {
    public termTypesInput: string[] = null;
    public isShowingInput: boolean = null;
    @Input()
    public termFormGroup: FormGroup;
    @Input()
    public validators: ValidatorFn[] = [];
    @Input()
    public placeholder = 'count';
    @Input()
    set isShowing(isShowing: boolean) {
        this.isShowingInput = isShowing;
        this.setValidatorsToControl(); // set validators when component is created
    }
    get isShowing(): boolean {
        return this.isShowingInput !== null ? this.isShowingInput : true;
    }
    @Input()
    set termTypes(termTypes: string[]) {
        this.termTypesInput = termTypes;
    }
    get termTypes(): string[] {
        return this.termTypesInput || Object.keys(TimeType);
    }

    constructor() { }

    ngOnInit(): void {

    }

    private setValidatorsToControl() {
        const dynamicValidators = this.isShowing ? this.validators.concat(Validators.required) : [];
        this.termFormGroup.get('count').setValidators(dynamicValidators);
        this.termFormGroup.get('count').updateValueAndValidity();
    }
}
