import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Config } from '../config/config';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable()
export class UserService {
    private user: any;
    private isLogin: boolean;
    private token: any;
    private socket: any;
    private device_token: any;

    constructor(private http: Http, private events: Events, private geolocation: Geolocation) {
        const self = this;
    }

    getUser(): any {
        if (!this.user) {
            this.user = JSON.parse(localStorage.getItem('user'));
            if (!this.user) {
                this.user = null;
            }
        }

        return this.user;
    }

    setUser(u: any) {
        this.user = u;
        localStorage.setItem('user', JSON.stringify(u));
    }

    getIsLogin(): any {
        if (this.isLogin === undefined) {
            this.isLogin = JSON.parse(localStorage.getItem('isLogin'));
            if (this.isLogin === undefined) {
                this.isLogin = false;
            }
        }

        return this.isLogin;
    }

    setToken(token: string) {
        localStorage.setItem('token', JSON.stringify(token));
    }

    getToken(): any {
        if (!this.token) {
            this.token = JSON.parse(localStorage.getItem('token'));
            if (!this.token) {
                this.token = null;
            }
        }

        return this.token;
    }

    setIsLogin(isLogin: boolean) {
        this.isLogin = isLogin;
        localStorage.setItem('isLogin', JSON.stringify(isLogin));
    }

    getStatusLabel(status) {
        switch (status) {
            case 0:
                return 'Active';
                break;
            case 1:
                return 'Inactive';
                break;
            case 2:
                return 'Holiday';
                break;
            case 3:
                return 'Off Work';
                break;
        }
    }

    authenticateUser(data): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/signin', data).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    registerUser(u: any): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/signup', u).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    getAllEmployers(): Promise<any> {
        const self = this;

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + self.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.get(Config.api_url + 'user/employers', opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    signOut(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.http.get(Config.api_url + 'user/signout').pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    setDeviceToken(device_token: string) {
        localStorage.setItem('device_token', JSON.stringify(device_token));
    }

    getDeviceToken(): any {
        if (!this.device_token) {
            this.device_token = JSON.parse(localStorage.getItem('device_token'));
            if (!this.device_token) {
                this.device_token = null;
            }
        }

        return this.device_token;
    }

    getAccumulate(data): any {
        const self = this;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + self.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/employee-accumulate', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    getStatisticsInfoByID(data: any): Promise<any> {
        const self = this;

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + self.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/statistics', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }

    updateBillingInfo(data: any): Promise<any> {
        const self = this;

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + self.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/update-pro-billing', data, opt).pipe(map(resp => resp.json())).subscribe(
                o => {
                    resolve(o);
                },
                err => {
                    reject(err.json());
                }
            );
        });
    }


    updateStatusInfo(data: any): Promise<any> {
        const self = this;

        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + self.getToken());
        const opt = new RequestOptions({ headers: headers });

        return new Promise((resolve, reject) => {
            self.http.post(Config.api_url + 'user/update-status', data, opt).pipe(map(resp => resp.json())).subscribe(
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
