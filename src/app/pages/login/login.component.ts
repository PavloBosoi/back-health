import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth/auth.service';
import { IUser } from '../../core/domain/iuser';
import { ROUTES } from '../../routes.constants';
import { IFBAuthDTO } from '../../core/domain/IfbauthDTO';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public form: FormGroup = new FormGroup({});
    public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
    public password: FormControl = new FormControl('', [Validators.required]);

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.form.addControl('email', this.email);
        this.form.addControl('password', this.password);
    }

    public submitForm() {
        if (this.form.valid) {
            const user: IUser = {
                email: this.email.value,
                password: this.password.value
            };
            this.authService.login(user).subscribe((fbAuthDTO: IFBAuthDTO) => {
                this.router.navigate([ROUTES.COURSES]);
            });
        }
    }
}
