import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IUser } from '../domain/iuser';
import { environment } from '../../../environments/environment';
import { IFBResponseDTO } from '../domain/ifbresponsedto';
import { FB } from '../../app.constants';

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

    public login(user: IUser): Observable<IFBResponseDTO> {
        user.returnSecureToken = true;
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`, user).pipe(
            take(1),
            tap(this.setToken)
        );
    }

    public logout() {
        this.setToken(null);
    }

    public isAuthenticated(): boolean {
        return !!this.token;
    }

    private setToken(fbResponse: IFBResponseDTO) {
        fbResponse ? this.setDataToLocalstorage(fbResponse) : localStorage.clear();

    }

    private setDataToLocalstorage(fbResponse: IFBResponseDTO) {
        const expireDate = new Date(new Date().getTime() + +fbResponse.expiresIn * 1000);
        localStorage.setItem(FB.TOKEN, fbResponse.idToken);
        localStorage.setItem(FB.EXPIRE_DATE, expireDate.toString());
    }
}
