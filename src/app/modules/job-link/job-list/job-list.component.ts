import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
})
export class JobListComponent implements OnInit {
  @Input() title: string = 'Job List';
  @Input() data: any[] = [];
  filterBy: any[] = [];
  activeFilter: number = 3;

  isActive: boolean = false;
  searchText: string = '';

  constructor() {
    this.filterBy = [
      {
        id: 0,
        title: 'Missed Inspections',
      },
      {
        id: 1,
        title: 'Due This Month',
      },
      {
        id: 2,
        title: 'Due Next Month',
      },
      {
        id: 3,
        title: 'All',
      },
    ];
  }

  ngOnInit() {}

  toggle() {
    this.isActive = !this.isActive;
  }
  close() {
    this.isActive = false;
  }
  onChangeFilterBy(event: any) {
    this.activeFilter = event;
  }
}
