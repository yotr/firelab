import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-cancel-report',
  templateUrl: './cancel-report.component.html',
  styleUrls: ['./cancel-report.component.css'],
})
export class CancelReportComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  yes() {
    $('#cancel_report_modal').modal('hide');
    this.router.navigate(['/modules/reports/incompletedReports']);
  }
  no() {
    $('#cancel_report_modal').modal('hide');
  }
}
