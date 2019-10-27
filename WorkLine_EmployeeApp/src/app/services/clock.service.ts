import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from '../config/config';

@Injectable()
export class ClockService {

    public isWork: boolean;

    public workTime: {
        startTime: any,
        endTime: any,
        start: number,
        end: number
    };

    public workTimeList: Array<any>;
    public workingTimeInMin: number;

    public tick: number;
    public serverTick: number;

    constructor(private http: Http, private userService: UserService, private events: Events, private geolocation: Geolocation) {
        this.workTime = {
            startTime: moment(),
            endTime: moment(),
            start: 0,
            end: 0
        };

        this.workTimeList = new Array<any>();
        this.startClock();
        this.tick = 0;
        this.serverTick = 0;

        this.workingTimeInMin = 0;
    }

    startClock() {
        const self = this;
        
        console.log("AAAAAAAAAAAA");
        setInterval(() => {
            const currentTime = moment();
            self.tick++;
            self.serverTick++;


            console.log("BBBBBBBB");
            if (self.tick === 60) {
                self.tick = 0;

                if (self.isWork) {
                    if (currentTime >= self.workTime.startTime && currentTime <= self.workTime.endTime) {
                        console.log(self.workTimeList);

            console.log("CCCCCCC");
                        if (self.workTimeList.length === 0) {
                            self.workTimeList.push({
                                startTime: currentTime,
                                endTime: currentTime,
                                start: self.timeToDegree(currentTime),
                                end: self.timeToDegree(currentTime)
                            });
                        } else {
                            const lastWorkTime = self.workTimeList[self.workTimeList.length - 1];

                            if (lastWorkTime.endTime.diff(currentTime, 'minute') < -2) {
                                self.workTimeList.push({
                                    startTime: currentTime,
                                    endTime: currentTime,
                                    start: self.timeToDegree(currentTime),
                                    end: self.timeToDegree(currentTime)
                                });
                            } else {
                                lastWorkTime.endTime = currentTime;
                                lastWorkTime.end = self.timeToDegree(currentTime);
                            }
                        }

                        self.workingTimeInMin = self.caculateWorkingTime();
                    }
                }
            }

            if (self.serverTick === 300) {
                self.serverTick = 0;

                if (self.isWork) {
                    if (currentTime >= self.workTime.startTime && currentTime <= self.workTime.endTime) {
                        self.sendLocationAndWorkInfo();
                    }
                }
            }

            this.events.publish('clock:tick', {}, Date.now());
        }, 1000);

    }

    startWork() {
        this.isWork = true;
    }

    stopWork() {
        this.isWork = false;
    }

    setWorkTime(time: any) {
        this.workTime = {
            startTime: moment(),
            endTime: moment(),
            start: 0,
            end: 0
        };

        this.workTime.startTime.set('hour', time.startTime.hour);
        this.workTime.startTime.set('minute', time.startTime.min);
        this.workTime.startTime.set('second', 0);
        this.workTime.start = this.timeToDegree(this.workTime.startTime);

        this.workTime.endTime.set('hour', time.endTime.hour);
        this.workTime.endTime.set('minute', time.endTime.min);
        this.workTime.endTime.set('second', 0);
        this.workTime.end = this.timeToDegree(this.workTime.endTime);
    }

    timeToDegree(time: any) {
        let hour = time.get('hour');
        let min = time.get('minute');

        hour = hour % 12;
        min = min / 60;

        let degree = hour;
        degree += parseFloat(min.toFixed(2));

        return degree;
    }

    caculateWorkingTime() {
        let total = 0;
        for (const workTime of this.workTimeList) {
            let m = workTime.endTime.diff(workTime.startTime, 'minute');
            total += (m + 1);
        }

        return total;
    }

    sendLocationAndWorkInfo() {
        const self = this;
        let data = [];
        for (const workTime of self.workTimeList) {
            data.push({
                startTime: workTime.startTime.format('YYYY-MM-DD HH:mm:00'),
                endTime: workTime.endTime.format('YYYY-MM-DD HH:mm:00'),
            });
        }

        self.sendLocationAndWorkTimeList({
            lat: 0, long: 0,
            workTimeList: data, date: moment().format('YYYY-MM-DD')
        });

        this.geolocation.getCurrentPosition().then((resp) => {
            let data = [];
            for (const workTime of self.workTimeList) {
                data.push({
                    startTime: workTime.startTime.format('YYYY-MM-DD HH:mm:00'),
                    endTime: workTime.endTime.format('YYYY-MM-DD HH:mm:00'),
                });
            }

            self.sendLocationAndWorkTimeList({
                lat: resp.coords.latitude, long: resp.coords.longitude,
                workTimeList: data, date: moment().format('YYYY-MM-DD')
            });
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    sendLocationAndWorkTimeList(data: any): Promise<any> {
        const self = this;

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + self.userService.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/employee-loc-time', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    getWorkTimeList(data): Promise<any> {
        const self = this;
        const headers = new Headers();

        headers.append('Authorization', 'Bearer ' + this.userService.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/employee-time', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }
}
