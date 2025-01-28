import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  months: any[] = [];
  years: any[] = [];
  currentMonth: string = '';
  currentTheme: any;

  // current language
  currentLanguage: any = localStorage.getItem('lang');
  totalJobsDueItemsCount: number = 0;
  thisMonthJobsTotal: number = 0;

  constructor(
    private toastr: ToastrService,
    public apiService: ApiService,
    private themeService: ThemeService
  ) {
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }
  ngAfterViewInit(): void {
    this.getDataDueAssignedJobs();
    this.getThisMonthJobs();
  }

  ngOnInit() {
    this.getYears();
    this.getCurrentMonthName();
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  getYears() {
    const currentYear = new Date().getFullYear(); // Get the current year
    const years = [];

    // Add the past 10 years and the current year
    for (let i = currentYear - 10; i <= currentYear; i++) {
      years.push(i.toString());
    }

    // Add the next 10 years
    for (let i = currentYear + 1; i <= currentYear + 10; i++) {
      years.push(i.toString());
    }

    this.years = years;
  }

  getCurrentMonthName() {
    const monthNames = this.months;

    const current = new Date().getMonth(); // getMonth() returns a 0-indexed month
    this.currentMonth = monthNames[current];
  }

  //get data
  getDataDueAssignedJobs(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'assignedJobs/getFilteredDueAssignedJobs',
        page ? page : 1,
        pageSize ? pageSize : 1
      )
      .subscribe({
        next: (data: any) => {
          // console.log(data);
          if (data?.isSuccess) {
            this.totalJobsDueItemsCount = data?.value?.totalCount;
          }
        },
        error: (err: any) => {
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
        // console.log(data);
        if (data?.isSuccess) {
          this.thisMonthJobsTotal = data?.value?.length;
        }
      },
      error: (err: any) => {
        console.log(err);
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
