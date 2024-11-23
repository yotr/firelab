import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  yes() {
    $('#confirmation_modal').modal('hide');
  }
  no() {
    $('#confirmation_modal').modal('hide');
  }
}
