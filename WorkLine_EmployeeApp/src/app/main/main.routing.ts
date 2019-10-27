import { MainComponent } from './main.component';
import { Routes, RouterModule } from '@angular/router';
import { PersonSummaryPage } from './pages/person-summary/person-summary';
import { PersonalCalendarPage } from './pages/personal-calendar/personal-calendar';
import { PersonalMonthYearPage } from './pages/personal-month-year/personal-month-year';
import { PersonalWeekMonthYearPage } from './pages/personal-week-month-year/personal-week-month-year';

import { StatisticsEmployeePage } from './pages/statistics-employee/statistics-employee';

import { CreateReminderPage } from './pages/create-reminder/create-reminder';
import { CreateNewDatePage } from './pages/create-new-date/create-new-date';
import { DepartmentPage } from './pages/department/department';
import { EmployeePage } from './pages/employee/employee';

import {TasksPage} from './pages/tasks/tasks';

import { ChatMessageEmployeePage } from './pages/chat-message-employee/chat-mssage-employee';
import { ChatMessagePage } from './pages/chat-message/chat-message';

import { ClockPage } from './pages/clock/clock';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'main',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'clock', pathMatch: 'full' },
            { path: 'personal-calendar', component: PersonalCalendarPage },
            { path: 'personal-month-year', component: PersonalMonthYearPage },
            { path: 'personal-week-month-year', component: PersonalWeekMonthYearPage },
            { path: 'person-summary', component: PersonSummaryPage },
            { path: 'create-reminder', component: CreateReminderPage },
            { path: 'create-new-date', component: CreateNewDatePage },
            { path: 'department', component: DepartmentPage },
            { path: 'employee', component: EmployeePage },
            { path: 'statistics-employee', component: StatisticsEmployeePage },
            { path: 'chat-message', component: ChatMessagePage },
            { path: 'chat-message-employee', component: ChatMessageEmployeePage },
            { path: 'tasks', component: TasksPage},
            { path: 'clock', component:ClockPage}
        ]
    }
];

export const MainRouting = RouterModule.forChild(routes);