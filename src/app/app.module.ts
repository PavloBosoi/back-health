import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './layouts/main/main.component';

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
    providers: [],
    bootstrap: [MainComponent]
})
export class AppModule { }
