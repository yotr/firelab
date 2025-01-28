import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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

  // charts data
  chartBarLabels: any[] = [];
  chartBarData: any[] = [];

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
    this.getData();
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

  lineChart(labels: any[], data1: any[], data2?: any[]) {
    const chart = new Chart('line-chart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Invoices',
            data: data1,
            backgroundColor: [
              'rgba(183, 27, 27, 0.9)',
              'rgba(255, 155, 68, 0.9)',
            ],
            borderColor: ['rgba(183, 27, 27)', 'rgba(255, 155, 68)'],
            borderWidth: 1,
            tension: 0.4,
          },
          // {
          //   label: 'Expenses',
          //   data: data2,
          //   backgroundColor: [
          //     'rgba(255, 155, 68, 0.9)',
          //     'rgba(252, 96, 117, 0.9)',
          //   ],
          //   borderColor: ['rgba(255, 155, 68)', 'rgba(252, 96, 117)'],
          //   borderWidth: 1,
          //   tension: 0.4,
          // },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  // barChart(labels: any[], data: any[]) {
  //   const chart = new Chart('line-chart', {
  //     type: 'line',
  //     data: {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: 'Revenue',
  //           data: data,
  //           backgroundColor: [
  //             'rgba(255, 155, 68, 0.9)',
  //             'rgba(252, 96, 117, 0.9)',
  //             'rgba(255, 155, 68, 0.9)',
  //             'rgba(252, 96, 117, 0.9)',
  //             'rgba(255, 155, 68, 0.9)',
  //             'rgba(252, 96, 117, 0.9)',
  //             'rgba(255, 155, 68, 0.9)',
  //             'rgba(252, 96, 117, 0.9)',
  //             'rgba(255, 155, 68, 0.9)',
  //             'rgba(252, 96, 117, 0.9)',
  //           ],
  //           borderColor: [
  //             'rgba(255, 155, 68)',
  //             'rgba(252, 96, 117)',
  //             'rgba(255, 155, 68)',
  //             'rgba(252, 96, 117)',
  //             'rgba(255, 155, 68)',
  //             'rgba(252, 96, 117)',
  //             'rgba(255, 155, 68)',
  //             'rgba(252, 96, 117)',
  //             'rgba(255, 155, 68)',
  //             'rgba(252, 96, 117)',
  //           ],
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  // }

  // get revenue
  getData() {
    let data = [
      { date: '2024-01-01', amount: 500 },
      { date: '2024-02-01', amount: 600 },
      { date: '2024-03-01', amount: 700 },
      { date: '2024-04-01', amount: 800 },
      { date: '2024-05-01', amount: 900 },
      { date: '2024-06-01', amount: 1000 },
      { date: '2024-07-01', amount: 1100 },
      { date: '2024-08-01', amount: 1200 },
      { date: '2024-09-01', amount: 1300 },
      { date: '2024-10-01', amount: 1400 },
    ];
    // this.apiService.get(`BudgetsRevenues`).subscribe({
    //   next: (data) => {
    //     // get chart keys from revenue data
    this.getChartBarKeys(data);
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    // });
  }
  // get revenue data
  getChartBarKeys(data: any[]) {
    // get data keys and values
    this.chartBarLabels = data?.map((value) => value?.date);
    this.chartBarData = data?.map((value) => value?.amount);

    this.lineChart(this.chartBarLabels, this.chartBarData);
    // console.log(this.chartBarData);
  }
}
