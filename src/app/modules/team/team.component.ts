import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  dataKeys: any[] = [];
  data: any[] = [];
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
    //   // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
    this.dataKeys = [
      {
        name: 'name',
        display: this.translateService.instant('team.table.name'),
        type: 'string',
        active: true,
      },
      {
        name: 'emailId',
        display: this.translateService.instant('team.table.email_id'),
        type: 'string',
        active: true,
      },
      {
        name: 'phone',
        display: this.translateService.instant('team.table.phone'),
        type: 'string',
        active: true,
      },
      {
        name: 'status',
        display: this.translateService.instant('team.table.status'),
        type: 'string',
        active: true,
      },
    ];
  }

  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    //   this.getCurrentUserData();
    this.getData();
  }

  ngAfterViewInit(): void {}
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
    this.data = [
      {
        id: 0,
        name: 'Team One',
        emailId: 'email@example.com',
        phone: '7890574534',
        status: 'checked',
      },
    ];

    this.loading = false;
    this.totalItemsCount = this.data.length;
    // api
    // this.apiService
    //   ?.filterData(
    //     'teamMembers/getFilteredTeamMembers',
    //     page ? page : 1,
    //     pageSize ? pageSize : 10
    //   )
    //   .subscribe({
    //     next: (data:any) => {
    //       console.log(data);
    //       if (data?.isSuccess) {
    //         this.data = data?.value;
    //         this.totalItemsCount = data?.totalCount;
    //         this.loading = false;
    //       }
    //     },
    //     error: (err: any) => {
    //       this.loading = false;
    //       if (this.currentLanguage == 'ar') {
    //         this.toastr.error('هناك شيء خاطئ', 'خطأ');
    //       } else {
    //         this.toastr.error('There Is Somthing Wrong', 'Error');
    //       }
    //     },
    //     complete: () => {},
    //   });
  }

  onPaginate(event: any) {
    this.getData(event?.page, event?.itemsPerPage);
  }

  search(event: any) {
    if (event?.value != null && event.value?.trim() != '') {
      this.apiService
        .globalSearch('teamMembers/globalsearch', event?.value, event?.column)
        .subscribe((data: any) => {
          console.log(data);
          this.data = data?.value;
          this.totalItemsCount = data?.value?.length;
          this.loading = false;
        });
    } else {
      this.getData();
    }
  }

  delete(deleteId: any) {
    console.log(deleteId);
    this.apiService.delete('teamMembers', deleteId).subscribe({
      next: (data) => {
        this.data = this.data.filter((item: any) => item?.id !== deleteId);

        if (data?.isSuccess) {
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
        'teamMembers/getFilteredTeamMembers',
        1,
        10,
        event?.column,
        event?.filters?.operator1,
        event?.filters?.operator2,
        event?.filters?.searchValue1,
        event?.filters?.searchValue2
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value;
            this.totalItemsCount = data?.totalCount;
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
  onStatusChange(data: any) {
    let id = data?.id;
    let status = data?.status == 0 ? true : false;

    let updated = false;
    this.apiService
      .statusChange(`teamMembers/updateStatus?status=${status}`, id, {})
      .subscribe({
        next: (data) => {
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تم تغيير الحالة بنجاح...');
            } else {
              this.toastr.success('status changed successfully...');
            }
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
        complete: () => {
          if (updated) {
            //success
            this.toastr.success(`Status Changed Successfully...`, 'Success');
          }
        },
      });
  }
}
