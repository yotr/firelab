import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-start-report-modal',
  templateUrl: './start-report-modal.component.html',
  styleUrls: ['./start-report-modal.component.css'],
})
export class StartReportModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  hideStartReport() {
    $('#start_report_modal').modal('hide');
    $('#confirmation_modal').modal('show');
  }
}
