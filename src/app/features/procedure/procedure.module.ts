import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedureComponent } from './procedure.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TermModule } from '../term/term.module';

@NgModule({
    declarations: [ProcedureComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        TermModule
    ],
    exports: [ProcedureComponent]
})
export class ProcedureModule { }
