import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-reports-sidebar',
  templateUrl: './customer-reports-sidebar.component.html',
  styleUrls: ['./customer-reports-sidebar.component.css'],
})
export class CustomerReportsSidebarComponent implements OnInit {
  reports: any[] = [];

  constructor() {
    this.reports = [
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
        link: '',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
      {
        id: 0,
        name: 'Spcial Hazard',
        icon: 'pi-exclamation-triangle',
      },
    ];
  }

  ngOnInit() {}
}
