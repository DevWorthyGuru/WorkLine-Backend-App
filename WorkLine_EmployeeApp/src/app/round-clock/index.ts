import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { RoundClockComponent } from './round-clock.component';
import { RoundClockService } from './round-clock.service';
import { RoundClockEase } from './round-clock.ease';
import { RoundClockConfig } from './round-clock.config';

export * from './round-clock.component';
export * from './round-clock.service';
export * from './round-clock.ease';
export * from './round-clock.config';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule
  ],
  declarations: [
    RoundClockComponent
  ],
  exports: [
    RoundClockComponent
  ],
  providers: [
    RoundClockService,
    RoundClockEase,
    RoundClockConfig
  ]
})
export class RoundClockModule { }
