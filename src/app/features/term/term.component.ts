import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TimeType } from '../../core/domain/enumeration/time-type.enum';

@Component({
    selector: 'app-term',
    templateUrl: './term.component.html',
    styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {
    public termTypes = Object.keys(TimeType);
    @Input()
    public termFormGroup: FormGroup;
    @Input()
    public placeholder = 'count';

    constructor() { }

    ngOnInit(): void {
        console.log(this.termFormGroup);
    }
}
