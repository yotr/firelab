import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css'],
})
export class NewReportComponent implements OnInit {
  // types
  types: any[] = [];
  typesLoading: boolean = true;
  // reports
  reports: any[] = [];
  reportsLoading: boolean = true;

  constructor() {
    this.types = ['Bell', 'Door Holder', 'Door Lock'];

    this.reports = ['Alarm', 'Fire Door'];
  }

  ngOnInit() {}
}
