import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MainRouting } from './main.routing';
import { MainComponent } from './main.component';

import { RoundProgressModule } from 'src/app/round-progress';

import { RoundClockModule } from 'src/app/round-clock';
import { IonCalendarModule } from 'src/app/ion-calendar/calendar.module';
import { NgCalendarModule } from 'src/app/ng-calendar/calendar.module';

import { AccordionComponent } from './components/accordion/accordion.component';
import { LayoutToolBarComponent } from './components/layout-toolbar/layout-toolbar.component';

import { PersonSummaryPage } from './pages/person-summary/person-summary';
import { PersonalCalendarPage } from './pages/personal-calendar/personal-calendar';
import { PersonalMonthYearPage } from './pages/personal-month-year/personal-month-year';
import { PersonalWeekMonthYearPage } from './pages/personal-week-month-year/personal-week-month-year';

import { StatisticsEmployeePage } from './pages/statistics-employee/statistics-employee';
import { TasksPage } from './pages/tasks/tasks';
import { CreateReminderPage } from './pages/create-reminder/create-reminder';
import { CreateNewDatePage } from './pages/create-new-date/create-new-date';
import { DepartmentPage } from './pages/department/department';
import { EmployeePage } from './pages/employee/employee';
import { ChatMessagePage } from './pages/chat-message/chat-message';
import { ChatMessageEmployeePage } from './pages/chat-message-employee/chat-mssage-employee';
import { ClockPage } from './pages/clock/clock';

import { UserService } from '../services/user.service';
import { UtilService } from '../services/util.service';
import { ChatService } from './../services/chat.service';
import { TimeService } from '../services/time.service';
import { ReminderService } from '../services/reminder.service';
import { TaskService } from '../services/task.service';
import { ClockService } from '../services/clock.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainRouting,
    IonCalendarModule,
    NgCalendarModule,
    RoundProgressModule,
    RoundClockModule,
  ],
  declarations: [
    MainComponent,
    AccordionComponent,
    LayoutToolBarComponent,
    PersonSummaryPage,
    PersonalCalendarPage,
    PersonalMonthYearPage,
    PersonalWeekMonthYearPage,
    CreateReminderPage,
    CreateNewDatePage,
    DepartmentPage,
    EmployeePage,
    StatisticsEmployeePage,
    ChatMessagePage,
    ChatMessageEmployeePage,
    TasksPage,
    ClockPage
  ],
  providers: [
    ChatService,
    UserService,
    UtilService,
    TimeService,
    ReminderService,
    TaskService,
    Geolocation,
    ClockService
  ]
})

export class MainModule { }
