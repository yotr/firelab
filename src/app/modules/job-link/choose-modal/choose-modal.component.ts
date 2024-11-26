import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-choose-modal',
  templateUrl: './choose-modal.component.html',
  styleUrls: ['./choose-modal.component.css'],
})
export class ChooseModalComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  assignJob() {
    $('#choose_modal').modal('hide');
    this.router.navigate(['/modules/jobLink/assignJob', this.uuidv4()]);
  }

  // getnerate random uuid
  uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}
