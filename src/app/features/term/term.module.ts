import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TermComponent } from './term.component';
import { OnlyNumbersDirective } from '../../shared/directives/numbers-only.directives';

@NgModule({
    declarations: [
        TermComponent,
        OnlyNumbersDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    exports: [
        TermComponent
    ]
})
export class TermModule { }
