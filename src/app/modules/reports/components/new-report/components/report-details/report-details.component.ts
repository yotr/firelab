import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
})
export class ReportDetailsComponent implements OnInit {
  // frequency
  frequencies: any[] = [];
  frequencyLoading: boolean = true;

  constructor() {
    this.frequencies = [
      'Weekly',
      'Bi Weekly',
      'Monthly',
      'Bi Monthly',
      'Quarterly',
      'Semi Annual',
      'Annual',
    ];
  }

  ngOnInit() {
    // this.startReport();
  }

  startReport() {
    $('#start_report_modal').modal('show');
  }
}
