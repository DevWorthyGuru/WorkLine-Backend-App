import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Config } from '../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class TimeService {
    constructor(private http: Http, private userService: UserService) { }

    getEmployeeMonthDataForPersonal(data): Promise<any> {
        const self = this;
        const headers = new Headers();

        headers.append('Authorization', 'Bearer ' + this.userService.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'time/employee-month-personal', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    getEmployeeWeekDataForPersonal(data: any): Promise<any> {
        const self = this;
        const headers = new Headers();

        headers.append('Authorization', 'Bearer ' + this.userService.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'time/employee-week-personal', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    getEmployeeWeekTimeDataForPersonal(data: any): Promise<any> {
        const self = this;
        const headers = new Headers();

        headers.append('Authorization', 'Bearer ' + this.userService.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'time/employee-week-time-personal', data, opt).pipe(map(resp => resp.json())).subscribe(
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
