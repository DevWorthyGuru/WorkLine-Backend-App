import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'employee',
    templateUrl: 'employee.html',
    styleUrls: ['employee.scss'],
})
export class EmployeePage {
    constructor(private _router: Router) { }

    openStatisticsEmployee() {
        this._router.navigate(['main/statistics-employee', { empID: 1, empName: 'Employee 1' }]);
    }
}
