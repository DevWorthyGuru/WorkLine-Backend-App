import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { TaskService } from 'src/app/services/task.service';

import * as moment from 'moment';

@Component({
    selector: 'tasks',
    templateUrl: 'tasks.html',
    styleUrls: ['tasks.scss'],
})

export class TasksPage {
    stat_opt: number;

    taskList: any = [
    ];

    constructor(private _router: Router, private utilService: UtilService, private taskService: TaskService) {
        this.stat_opt = 0;

        const self = this;

        this.taskService.getAllTasks({}).then(async function (o) {
            self.utilService.closeLoading();
            if (o.success) {
                self.taskList = o.data.taskList;
            } else {
                self.utilService.showErrorToast(o.message);
            }
        }, (error) => {
            this.utilService.closeLoading();
            this.utilService.showErrorToast(error.message);
        });
    }

    changeStatOption(opt: number) {
        this.stat_opt = opt;
        switch (this.stat_opt) {
            case 0:
                break;
            case 1:
                break;
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    getDateString(d: any) {
        const m = moment(d);
        return m.format('MMM, D');
    }

    getTimeString(d: any) {
        const m = moment(d);
        return m.format('hh : mm A');
    }
}