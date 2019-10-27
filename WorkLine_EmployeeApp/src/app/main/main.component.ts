import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
})

export class MainComponent {
    constructor(private _router: Router, private sheetCtrl: ActionSheetController) {
    }

    showPersonalCalendar() {
        this._router.navigateByUrl('main/personal-calendar');
    }

    showPersonSummary() {
        this._router.navigateByUrl('main/person-summary');
    }

    showClock() {
        this._router.navigateByUrl('main/clock');
    }

    showTasks() {
        this._router.navigateByUrl('main/tasks');
    }

    showChatMessage() {
        this._router.navigateByUrl('main/chat-message');
    }
}
