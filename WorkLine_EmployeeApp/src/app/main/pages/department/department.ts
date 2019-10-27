import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'department',
    templateUrl: 'department.html',
    styleUrls: ['department.scss'],
})
export class DepartmentPage {
    constructor(private _router: Router) { }

    showEmployeePage() {
        this._router.navigate(['main/employee', { empID: 1, empName: 'Employee 1' }]);
    }
}
