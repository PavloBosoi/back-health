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
    public termTypes = Object.keys(TimeType);
    public isShowing = true;
    @Input()
    public termFormGroup: FormGroup;
    @Input()
    public validators: ValidatorFn[] = [];
    @Input()
    public placeholder = 'count';
    @Input('isShowing')
    set ShowComp(isShowing: boolean) {
        this.isShowing = isShowing;
        this.setValidatorsToControl(); // set validators when component is created
    }
    @Input('termTypes')
    set TermTypes(termTypes: string[]) {
        if (termTypes) {
            this.termTypes = termTypes;
        }
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
