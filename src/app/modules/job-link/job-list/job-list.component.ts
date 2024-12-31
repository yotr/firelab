import { Component, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css'],
})
export class JobListComponent implements OnInit {
  @Input() title: string = 'Job List';
  currentLanguage: any = localStorage.getItem('lang');
  filterBy: any[] = [];
  activeFilter: number = 1;
  isActive: boolean = false;
  searchText: string = '';
  missedJobs: any[] = [];
  missedLoading: boolean = true;
  nextMonthJobs: any[] = [];
  nextMonthLoading: boolean = true;
  thisMonthJobs: any[] = [];
  thisMonthLoading: boolean = true;
  selectedJobId: any = null;

  constructor(
    public translateService: TranslateService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
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

  ngOnInit() {
    this.getJobs(1);
  }

  selectJob(jobId: any) {
    this.selectedJobId = jobId;
  }

  toggle() {
    this.isActive = !this.isActive;
  }
  close() {
    this.isActive = false;
  }
  onChangeFilterBy(event: any) {
    this.activeFilter = event?.id;
    this.getJobs(event?.id);
  }
  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }
  //get data
  getJobs(id: number) {
    if (id == 0) {
      this.getMissedJobs();
    } else if (id == 1) {
      this.getThisMonthJobs();
    } else if (id == 2) {
      this.getNextMonthJobs();
    } else {
      this.getMissedJobs();
      this.getThisMonthJobs();
      this.getNextMonthJobs();
    }
  }

  getMissedJobs() {
    // api missed
    this.apiService.get(`jobs/missed`).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.missedJobs = data?.value;
          this.missedLoading = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.missedLoading = false;
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {},
    });
  }
  getThisMonthJobs() {
    // api missed
    this.apiService.get(`jobs/thisMonth`).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.thisMonthJobs = data?.value;
          this.thisMonthLoading = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.thisMonthLoading = false;
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {},
    });
  }
  getNextMonthJobs() {
    // api missed
    this.apiService.get(`jobs/nextMonth`).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.nextMonthJobs = data?.value;
          this.nextMonthLoading = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.nextMonthLoading = false;
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {},
    });
  }
}
