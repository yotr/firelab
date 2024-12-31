import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css'],
})
export class MyJobsComponent implements OnInit, AfterViewInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  dataKeys: any[] = [];
  data: any[] = [];
  getDataError: boolean = false;
  totalItemsCount: number = 0;
  loading: boolean = true;
  // current logged in user
  currentUser: any = {} as any;

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    //   //get id
    //   this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
    //     if (paramMap['get']('operationid')) {
    //       this.operationId = paramMap['get']('operationid');
    //     }
    //   });
    //   // get query parameters
    //   this.activatedRoute.queryParams.subscribe((query) => {
    //     this.view_type = query['view_type'];
    //   });

    //   // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
    this.dataKeys = [
      {
        name: 'jobId',
        display: this.translateService.instant('jobs.table.job_id'),
        type: 'string',
        active: true,
      },
      {
        name: 'name',
        display: this.translateService.instant('jobs.table.name'),
        type: 'string',
        active: true,
      },
      {
        name: 'reportCategory',
        display: this.translateService.instant('jobs.table.report_category'),
        type: 'object',
        active: true,
      },
      {
        name: 'frequency',
        display: this.translateService.instant('jobs.table.frequency'),
        type: 'string',
        active: true,
      },
      {
        name: 'dateTime',
        display: this.translateService.instant('jobs.table.date'),
        type: 'string',
        active: true,
      },
      {
        name: 'type',
        display: this.translateService.instant('jobs.table.type'),
        type: 'string',
        active: true,
      },
    ];
  }
  ngAfterViewInit(): void {
    this.getData();
  }

  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    this.getCurrentUserData();
  }

  // ngAfterViewInit(): void {
  // }
  // get user
  isLoggedIn(): boolean {
    return this.auth.currentUserSignal() == undefined ? false : true;
  }

  getCurrentUserData() {
    if (this.isLoggedIn()) {
      this.currentUser = this.auth.currentUserSignal()?.userData;
    }
    console.log(this.currentUser);
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
      this.translateService.use(this.currentLanguage);
    });
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
      ?.filterDataWithUserId(
        'assignedJobs/getFilteredAssignedJobs',
        page ? page : 1,
        pageSize ? pageSize : 20,
        this.currentUser?.id
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
    // if (event?.value != null && event.value?.trim() != '') {
    //   this.apiService
    //     .globalSearch('assignedJobs/globalsearch', event?.value, event?.column)
    //     .subscribe({
    //       next: (data: any) => {
    //         if (data?.isSuccess) {
    //           console.log(data);
    //           this.data = data?.value;
    //           this.totalItemsCount = data?.value?.length;
    //         }
    //         this.loading = false;
    //       },
    //       error: (err: any) => {
    //         this.loading = false;
    //         if (this.currentLanguage == 'ar') {
    //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
    //         } else {
    //           this.toastr.error('There Is Somthing Wrong', 'Error');
    //         }
    //       },
    //     });
    // } else {
    //   this.getData();
    // }
  }

  delete(deleteId: any) {
    console.log(deleteId);
    this.apiService.delete('jobs', deleteId).subscribe({
      next: (data) => {
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
      .filterDataWithUserId(
        'assignedJobs/getFilteredAssignedJobs',
        1,
        20,
        this.currentUser?.id,
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
            this.loading = false;
          }
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
  //change status
  // onStatusChange(data: any) {
  //   let id = data?.id;
  //   let status = data?.status;

  //   this.apiService
  //     .statusChange(`teamMembers/updateStatus/${id}?status=${status}`, {})
  //     .subscribe({
  //       next: (data) => {
  //         if (data?.isSuccess) {
  //           if (this.currentLanguage == 'ar') {
  //             this.toastr.success('تم تغيير الحالة بنجاح...');
  //           } else {
  //             this.toastr.success('status changed successfully...');
  //           }
  //         }
  //       },
  //       error: (err: any) => {
  //         console.log(err);
  //         if (this.currentLanguage == 'ar') {
  //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //         } else {
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         }
  //       },
  //       complete: () => {},
  //     });
  // }
}
