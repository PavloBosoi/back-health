import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IUser } from '../../domain/iuser';
import { environment } from '../../../../environments/environment';
import { IFBAuthDTO } from '../../domain/IfbauthDTO';
import { FB } from '../../../app.constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    public get token(): string {
        const expireDate = new Date(localStorage.getItem(FB.EXPIRE_DATE));
        if (new Date() > expireDate) {
            this.logout();
            return null;
        }
        return localStorage.getItem(FB.TOKEN);
    }

    public login(user: IUser): Observable<IFBAuthDTO> {
        user.returnSecureToken = true; // using in firebase for expired date in response
        return this.http.post<IFBAuthDTO>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, user).pipe(
            tap((fbAuthDTO: IFBAuthDTO) => this.setToken(fbAuthDTO)),
            take(1)
        );
    }

    public logout() {
        this.setToken(null);
    }

    public isAuthenticated(): boolean {
        return !!this.token;
    }

    private setToken(fbAuthDTO: IFBAuthDTO) {
        fbAuthDTO ? this.setDataToLocalstorage(fbAuthDTO) : localStorage.clear();

    }

    private setDataToLocalstorage(fbAuthDTO: IFBAuthDTO) {
        const expireDate = new Date(new Date().getTime() + +fbAuthDTO.expiresIn * 1000);
        localStorage.setItem(FB.TOKEN, fbAuthDTO.idToken);
        localStorage.setItem(FB.EXPIRE_DATE, expireDate.toString());
    }
}
