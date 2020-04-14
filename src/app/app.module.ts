import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Provider } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './layouts/main/main.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

const INTERCEPTORS: Provider[] = [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: AuthInterceptor
}];

@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule
    ],
    providers: [...INTERCEPTORS],
    bootstrap: [MainComponent]
})
export class AppModule { }
