import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-tabs',
  templateUrl: './report-tabs.component.html',
  styleUrls: ['./report-tabs.component.css'],
})
export class ReportTabsComponent implements OnInit {
  activeTab: any = 1;

  constructor() {}

  ngOnInit() {}

  openTab(tab: any) {
    this.activeTab = tab;
  }
}
