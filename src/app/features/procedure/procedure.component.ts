import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-procedure',
    templateUrl: './procedure.component.html',
    styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements OnInit {
    @Input()
    public procedureFormGroup: FormGroup;

    constructor() { }

    ngOnInit(): void {

    }

}
