import { Router } from '@angular/router';
import { UserService } from './../../../services/user.service';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { ClockService } from 'src/app/services/clock.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'clock',
  templateUrl: 'clock.html',
  styleUrls: ['clock.scss'],
})

export class ClockPage {
  public accumulateOption: any;
  public accumulateList: Array<any>;
  public status: boolean;
  constructor(private _router: Router, private clockService: ClockService,
    private userService: UserService, private utilService: UtilService) {

    let t = {};
    if (userService.getUser().startTime && userService.getUser().endTime) {
      t = {
        startTime: userService.getUser().startTime,
        endTime: userService.getUser().endTime
      };
    } else {
      t = {
        startTime: { hour: 10, min: 30 },
        endTime: { hour: 19, min: 30 }
      };
    }

    this.clockService.setWorkTime(t);

    this.getWorkTimeListFromServer({
      date: moment().format('YYYY-MM-DD')
    });

    this.accumulateOption = 0;

    this.accumulateList = new Array<{}>();

    this.status = this.userService.getUser().status ? true: false;
  }

  async changeStatus() {
    await this.updateStatus({ status: this.status });
  }



  async updateStatus(data) {
    await this.utilService.showLoading();
    const self = this;
    this.userService.updateStatusInfo(data).then(async function (o) {
      await self.utilService.closeLoading();
      if (o.success) {
      } else {
        self.utilService.showErrorToast(o.message);
      }
    }, (error) => {
      self.utilService.closeLoading();
      self.utilService.showErrorToast(error.message);
    });
  }

  getWorkState() {
    if (this.clockService.isWork) {
      return true;
    } else {
      return false;
    }
  }

  startTimer() {
    if (!this.status) {
      this.utilService.showErrorToast('You should be active for this work.');
      return;
    }

    this.clockService.startWork();
  }

  endTimer() {
    this.clockService.stopWork();
  }

  getCurrentTime() {
    const m = this.clockService.workingTimeInMin;
    let hour = Math.floor(m / 60);
    let second = m % 60;

    return (hour >= 10 ? hour : ('0' + hour)) + ':' + (second >= 10 ? second : ('0' + second));
  }

  getStartTimeDegree() {
    if (this.clockService.workTime.startTime) {
      return this.clockService.workTime.start;
    }
  }

  getEndTimeDegree() {
    if (this.clockService.workTime.startTime) {
      return this.clockService.workTime.end;
    }
  }

  getStartTimeString() {
    if (this.clockService.workTime.startTime) {
      return this.clockService.workTime.startTime.format('HH:mm');
    }
  }

  getEndTimeString() {
    if (this.clockService.workTime.endTime) {
      return this.clockService.workTime.endTime.format('HH:mm');
    }
  }

  getWorkTimeList() {
    if (this.clockService.workTimeList) {
      return this.clockService.workTimeList;
    } else {
      return [];
    }
  }

  clickOption(opt: number) {
    this.accumulateOption = opt;
    this.getAccumulate();
  }

  getCurrentDateString() {
    let m = moment();

    return m.format('DD MMMM Y');
  }

  async getWorkTimeListFromServer(data: any) {
    await this.utilService.showLoading();
    const self = this;

    self.clockService.getWorkTimeList(data).then(async function (o) {
      await self.utilService.closeLoading();
      if (o.success) {
        for (const time of o.data.times) {
          const workTime = {
            startTime: moment(time.startTime),
            endTime: moment(time.endTime),
            start: 0,
            end: 0
          };

          workTime.start = self.clockService.timeToDegree(workTime.startTime);
          workTime.end = self.clockService.timeToDegree(workTime.endTime);

          self.clockService.workTimeList.push(workTime);
        }

        self.clockService.workingTimeInMin = self.clockService.caculateWorkingTime();

        self.getAccumulate();
      } else {
        self.utilService.showErrorToast(o.message);
      }
    }, (error) => {
      self.utilService.closeLoading();
      self.utilService.showErrorToast(error.message);
    });
  }

  async getAccumulate() {
    await this.utilService.showLoading();
    const self = this;

    self.userService.getAccumulate({
      type: self.accumulateOption,
      date: moment().format('YYYY-MM-DD')
    }).then(async function (o) {
      await self.utilService.closeLoading();
      if (o.success) {
        self.accumulateList = o.data;
      } else {
        self.utilService.showErrorToast(o.message);
      }
    }, (error) => {
      self.utilService.closeLoading();
      self.utilService.showErrorToast(error.message);
    });
  }

  statisticsPage() {
    const user = this.userService.getUser();
    this._router.navigate(['main/statistics-employee', { empID: user._id, empName: user.name }]);
  }
}
