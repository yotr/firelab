import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css'],
})
export class CustomerHomeComponent implements OnInit {
  percentages: any[] = [];
  acount_types: any[] = [];
  pricing_levels: any[] = [];
  inspectionsDue: any[] = [];
  inspectionsDone: any[] = [];
  inspectionsDueKeys: any[] = [];
  inspectionsDoneKeys: any[] = [];
  inspectionsDueLoading: boolean = false;
  inspectionsDoneLoading: boolean = false;

  constructor() {
    this.acount_types = ['master', 'sub', 'building'];
    this.inspectionsDueKeys = [
      {
        name: 'category',
        display: 'Category',
        type: 'string',
        active: true,
      },
      {
        name: 'frequency',
        display: 'Frequency',
        type: 'string',
        active: true,
      },
      {
        name: 'month',
        display: 'Month',
        type: 'string',
        active: true,
      },
      {
        name: 'pendingDue',
        display: 'Pending Due',
        type: 'string',
        active: true,
      },
      {
        name: 'tasks',
        display: 'Tasks',
        type: 'boolean',
        active: true,
      },
    ];
    this.inspectionsDoneKeys = [
      {
        name: 'category',
        display: 'Category',
        type: 'string',
        active: true,
      },
      {
        name: 'frequency',
        display: 'Frequency',
        type: 'string',
        active: true,
      },
      {
        name: 'month',
        display: 'Month',
        type: 'string',
        active: true,
      },
      {
        name: 'done',
        display: 'Done',
        type: 'string',
        active: true,
      },
      {
        name: 'tasks',
        display: 'Tasks',
        type: 'boolean',
        active: true,
      },
    ];
  }

  ngOnInit() {}
}
