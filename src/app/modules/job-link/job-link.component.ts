import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotNavigatorComponent,
} from '@daypilot/daypilot-lite-angular';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/jobLink/data.service';

@Component({
  selector: 'app-job-link',
  templateUrl: './job-link.component.html',
  styleUrls: ['./job-link.component.css'],
})
export class JobLinkComponent implements OnInit, AfterViewInit {
  @ViewChild('navigator') navigator!: DayPilotNavigatorComponent;
  @ViewChild('calendar') calendar!: DayPilotCalendarComponent;
  view: any = null;
  currentLanguage: any = localStorage.getItem('lang');

  get date(): DayPilot.Date {
    return this.config.startDate as DayPilot.Date;
  }

  set date(value: DayPilot.Date) {
    this.config.startDate = value;
  }

  navigatorConfig: DayPilot.NavigatorConfig = {
    showMonths: 3,
    skipMonths: 3,
    selectMode: this.view == null ? 'Week' : this.view,
    cellWidth: 30,
    cellHeight: 30,
    dayHeaderHeight: 30,
    titleHeight: 30,
  };

  events: DayPilot.EventData[] = [];

  config: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    viewType: this.view == null ? 'Week' : this.view,
    cellHeight: 30,
    headerHeight: 30,
    hourWidth: 60,
  };

  constructor(
    private ds: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    //get view
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('view')) {
        this.view = paramMap['get']('view');
        console.log(paramMap['get']('view'));
      }
    });
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.navigatorConfig = {
      showMonths: 2,
      skipMonths: 2,
      selectMode: this.view == null ? 'Week' : this.view,
      cellWidth: 30,
      cellHeight: 30,
      dayHeaderHeight: 30,
      titleHeight: 30,
    };
    this.config = {
      startDate: DayPilot.Date.today(),
      viewType: this.view == null ? 'Week' : this.view,
      cellHeight: 22,
      headerHeight: 30,
      hourWidth: 50,
    };
  }

  viewChange(): void {
    var from = this.calendar.control.visibleStart();
    var to = this.calendar.control.visibleEnd();
    this.getAssignedJobs(from, to);
  }

  navigatePrevious(event: any): void {
    event.preventDefault();
    let endDate = this.config.startDate;
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(
      -7
    );
    console.log(this.config.startDate);
    let startDate = this.config.startDate;
    console.log('Start Date: ' + startDate + ', End Date: ' + endDate);
    this.getAssignedJobs(startDate, endDate);
  }

  navigateNext(event: any): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(7);
    console.log(this.config.startDate);
    let startDate = this.config.startDate;
    let endDate = (startDate as DayPilot.Date).addDays(7);
    console.log('Start Date: ' + startDate + ', End Date: ' + endDate);
    this.getAssignedJobs(startDate, endDate);
  }

  navigateToday(event: any): void {
    event.preventDefault();
    this.config.startDate = DayPilot.Date.today();
    console.log(this.config.startDate);
    let startDate = this.config.startDate;
    let endDate = (this.config.startDate as DayPilot.Date).addDays(7);
    console.log('Start Date: ' + startDate + ', End Date: ' + endDate);
    this.getAssignedJobs(startDate, endDate);
  }

  setView(event: any): void {
    this.view = event.target.value;
    let newView = event.target.value;

    this.router.navigate(['/modules/jobLink'], {
      queryParams: { view: newView },
    });

    setTimeout(() => {
      // reload page
      window.location.reload();
    }, 1000);
  }

  getAssignedJobs(from: any, to: any): void {
    this.ds
      .getEvents('assignedJobs/getAssignedJobsBetweenDates', from, to)
      .subscribe({
        next: (result: any) => {
          if (result?.isSuccess) {
            console.log(result.value);

            // console.log((this.config.startDate as DayPilot.Date).addDays(7));
            // item?.startDate;
            // Modify the startDate in the array
            const updatedData = result?.value.map((item: any) => {
              // Create a new Date object from the startDate string
              // let customStartDate = new Date(item?.startDate).toISOString();
              let id = item?.id;
              let newStart = (item?.startDate as DayPilot.Date);
              let newEnd = item?.endDate ? item?.endDate : newStart;
              let text = item?.job?.name;
              // Return the updated object with the new startDate
              return {
                id: id,
                start: newStart,
                end: newEnd,
                text: text,
              };
            });
            this.events = updatedData;
          }
          //   {
          //     id: '1',
          //     start: DayPilot.Date.today().addHours(10),
          //     end: DayPilot.Date.today().addHours(12),
          //     text: 'Event 1 \n ibrahim abdelrahman',
          //   },
        },
        error: (error) => {
          console.log(error);
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
      });
  }
}
