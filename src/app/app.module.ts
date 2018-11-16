import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    SliderComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
