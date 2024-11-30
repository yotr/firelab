import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-report-tabs',
  templateUrl: './report-tabs.component.html',
  styleUrls: ['./report-tabs.component.css'],
})
export class ReportTabsComponent implements OnInit {
  activeTab: any = 1;
  tab: any = 1;
  reportId: any = 1;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    //get queries
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('tab')) {
        this.activeTab = paramMap['get']('tab');
      }
    });
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.reportId = paramMap['get']('id');
      }
    });
  }

  ngOnInit() {}

  openTab(tab: any) {
    this.activeTab = tab;
    this.router.navigate([], {
      queryParams: { tab: tab },
    });
  }
}
