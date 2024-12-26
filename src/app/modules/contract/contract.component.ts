import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
})
export class ContractComponent implements OnInit, AfterViewInit {
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
    // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
    this.dataKeys = [
      {
        name: 'contractReference',
        display: this.translateService.instant(
          'contracts.contract_table.contractReference'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'teamMember',
        display: this.translateService.instant(
          'contracts.contract_table.member'
        ),
        type: 'object',
        active: true,
      },
      {
        name: 'jobPosition',
        display: this.translateService.instant(
          'contracts.contract_table.jobPosition'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'contractStartDate',
        display: this.translateService.instant(
          'contracts.contract_table.startDate'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'contractEndDate',
        display: this.translateService.instant(
          'contracts.contract_table.endDate'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'status',
        display: this.translateService.instant(
          'contracts.contract_table.status'
        ),
        type: 'boolean',
        active: true,
      },
    ];
  }

  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    this.getData();
    //   this.getCurrentUserData();
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
    // api
    this.loading = true;
    this.apiService
      ?.filterData(
        'contracts/getFilteredContracts',
        page ? page : 1,
        pageSize ? pageSize : 20
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value?.contracts;
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
      this.apiService
        .globalSearch('contracts/globalsearch', event?.value, event?.column)
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
    this.apiService.delete('contracts', deleteId).subscribe({
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
      .filterData(
        'contracts/getFilteredContracts',
        1,
        20,
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
            this.data = data?.value?.contracts;
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
  onStatusChange(data: any) {
    let id = data?.id;
    let status = data?.status ? true : false;

    this.apiService
      .statusChange(`contracts/updateStatus/${id}?status=${status}`, {})
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
        complete: () => {},
      });
  }
}
