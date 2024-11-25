import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-customer-reports-sidebar',
  templateUrl: './customer-reports-sidebar.component.html',
  styleUrls: ['./customer-reports-sidebar.component.css'],
})
export class CustomerReportsSidebarComponent implements OnInit {
  reports: any[] = [];

  activeReport: string = '';

  constructor(private activatedRoute: ActivatedRoute) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('report')) {
        this.activeReport = paramMap['get']('report');
      }
    });

    this.reports = [
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
        link: '',
      },
      {
        id: 1,
        name: 'Alarm',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 3,
        name: 'Lighting',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 4,
        name: 'Fire Door',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 5,
        name: 'Doors',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 6,
        name: 'Testing',
        icon: 'pi-exclamation-triangle',
      },
      
    ];
  }

  ngOnInit() {}
}
