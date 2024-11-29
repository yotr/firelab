import { Component, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(public translateService: TranslateService) {
    this.filterBy = [
      {
        id: 0,
        title: this.translateService.instant('job_link.list.missed'),
      },
      {
        id: 1,
        title: this.translateService.instant('job_link.list.due_this'),
      },
      {
        id: 2,
        title: this.translateService.instant('job_link.list.due_next'),
      },
      {
        id: 3,
        title: this.translateService.instant('job_link.list.all'),
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
