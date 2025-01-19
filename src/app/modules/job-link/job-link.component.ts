import {
  AfterViewInit,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotNavigatorComponent,
} from '@daypilot/daypilot-lite-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/jobLink/data.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-job-link',
  templateUrl: './job-link.component.html',
  styleUrls: ['./job-link.component.css'],
})
export class JobLinkComponent implements OnInit, AfterViewInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  data: any[] = [] as any[];
  getDataError: boolean = false;
  loading: boolean = true;
  totalItemsCount: number = 0;
  dataKeys: any[] = [];
  // current logged in user
  currentUser: any = {} as any;

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
    private router: Router,
    private toastr: ToastrService,
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    public apiService: ApiService,
    private auth: AuthService
  ) {
    //get view
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('view')) {
        this.view = paramMap['get']('view');
        console.log(paramMap['get']('view'));
      }
    });

    // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
    this.dataKeys = [
      {
        name: 'job',
        display: this.translateService.instant('job_link.table.job'),
        type: 'object',
        active: true,
      },
      {
        name: 'startDate',
        display: this.translateService.instant('job_link.table.startDate'),
        type: 'string',
        active: true,
      },
      {
        name: 'endDate',
        display: this.translateService.instant('job_link.table.endDate'),
        type: 'string',
        active: true,
      },
      {
        name: 'hours',
        display: this.translateService.instant('job_link.table.hours'),
        type: 'string',
        active: true,
      },
      {
        name: 'minutes',
        display: this.translateService.instant('job_link.table.minutes'),
        type: 'string',
        active: true,
      },
      {
        name: 'meridiem',
        display: this.translateService.instant('job_link.table.meridiem'),
        type: 'string',
        active: true,
      },
      {
        name: 'external',
        display: this.translateService.instant('job_link.table.external'),
        type: 'boolean',
        active: true,
      },
      {
        name: 'status',
        display: this.translateService.instant('job_link.table.status'),
        type: 'object',
        active: true,
      },
    ];
  }
  ngOnInit(): void {
    this.getLanguage();
    this.getTheme();
    this.getData();
  }

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

  // get user
  isLoggedIn(): boolean {
    return this.auth.currentUserSignal() == undefined ? false : true;
  }

  getCurrentUserData() {
    if (this.isLoggedIn()) {
      this.currentUser = this.auth.currentUserSignal()?.userData;
    }
  }

  getTheme() {
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  getLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(language);
    });
  }

  viewChange(): void {
    var from = this.calendar.control.visibleStart();
    var to = this.calendar.control.visibleEnd();
    // this.getAssignedJobs(from, to);
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
    // this.getAssignedJobs(startDate, endDate);
  }

  navigateNext(event: any): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(7);
    console.log(this.config.startDate);
    let startDate = this.config.startDate;
    let endDate = (startDate as DayPilot.Date).addDays(7);
    console.log('Start Date: ' + startDate + ', End Date: ' + endDate);
    // this.getAssignedJobs(startDate, endDate);
  }

  navigateToday(event: any): void {
    event.preventDefault();
    this.config.startDate = DayPilot.Date.today();
    console.log(this.config.startDate);
    let startDate = this.config.startDate;
    let endDate = (this.config.startDate as DayPilot.Date).addDays(7);
    console.log('Start Date: ' + startDate + ', End Date: ' + endDate);
    // this.getAssignedJobs(startDate, endDate);
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
              let newStart = item?.startDate as DayPilot.Date;
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

  // Handle the event click
  onEventClick(e: any): void {
    const eventData = e.data; // `data` contains the event details

    // Access event properties
    const eventId = eventData.id;
    const eventStart = eventData.start;
    const eventEnd = eventData.end;
    const eventText = eventData.text;

    // Log the clicked event's details
    console.log('Event clicked:', eventData);
    console.log(`Event ID: ${eventId}`);
    console.log(`Start Date: ${eventStart}`);
    console.log(`End Date: ${eventEnd}`);
    console.log(`Text: ${eventText}`);

    // You can display a modal, navigate to a detail page, etc.
    DayPilot.Modal.alert(
      `Event ID: ${eventId}\nStart: ${eventStart}\nEnd: ${eventEnd}\nText: ${eventText}`
    );
  }

  //get data
  getData(
    page?: number,
    pageSize?: number,
    column?: any,
    operator1?: any,
    operator2?: any,
    value1?: any,
    value2?: any
  ) {
    // api
    this.loading = true;
    this.apiService
      ?.filterData(
        'assignedJobs/getFilteredAssignedJobs',
        page ? page : 1,
        pageSize ? pageSize : 20
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value?.jobsDtos;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.getDataError = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {},
      });
  }

  onPaginate(event: any) {
    this.getData(event?.page, event?.itemsPerPage);
  }

  search(event: any) {
    if (event?.value != null && event.value?.trim() != '') {
      this.loading = true;
      this.apiService
        .globalSearch('assignedJobs/globalsearch', event?.value, event?.column)
        .subscribe({
          next: (data: any) => {
            if (data?.isSuccess) {
              console.log(data);
              this.data = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            if (this.currentLanguage == 'ar') {
              this.toastr.error('هناك شيء خاطئ', 'خطأ');
            } else {
              this.toastr.error('There Is Somthing Wrong', 'Error');
            }
          },
        });
    } else {
      this.getData();
    }
  }

  delete(deleteId: any) {
    console.log(deleteId);
    this.apiService.delete('assignedJobs', deleteId).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.data = this.data.filter((item: any) => item?.id !== deleteId);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم حذف العنصر بنجاح...');
          } else {
            this.toastr.success('item deleted successfully...');
          }
        }
      },
      error: (err) => {
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
  //filters handle
  handleFiltersSubmit(event: any) {
    this.loading = true;
    // check if filters operator  contains selected
    this.apiService
      .filterData(
        'assignedJobs/getFilteredAssignedJobs',
        1,
        20,
        event?.column,
        event?.filters?.operator1,
        event?.filters?.operator2,
        event?.filters?.searchValue1,
        event?.filters?.searchValue2
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value?.jobsDtos;
            this.totalItemsCount = data?.value?.totalCount;
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {},
      });
  }

  resetData() {
    this.getData();
  }
}
