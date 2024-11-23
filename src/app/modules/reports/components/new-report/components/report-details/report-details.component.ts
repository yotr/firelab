import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
})
export class ReportDetailsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.startReport();
  }

  startReport() {
    $('#start_report_modal').modal('show');
  }
}
