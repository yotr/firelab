import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotNavigatorComponent,
} from '@daypilot/daypilot-lite-angular';
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
    private router: Router
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
    this.ds.getEvents(from, to).subscribe((result) => {
      this.events = result;
    });
  }

  navigatePrevious(event: any): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(
      -7
    );
  }

  navigateNext(event: any): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(7);
  }

  navigateToday(event: any): void {
    event.preventDefault();
    this.config.startDate = DayPilot.Date.today();
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
}
