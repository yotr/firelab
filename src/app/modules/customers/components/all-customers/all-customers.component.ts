import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;
@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css'],
})
export class AllCustomersComponent implements OnInit, AfterViewInit {
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

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public apiService: ApiService,
    private permissionsService: PermissionsService,
    private auth: AuthService,
    private sidebarService: SidebarService
  ) {
    //   // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);

    this.dataKeys = [
      {
        name: 'businessName',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.companyName'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'idAccount',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.id'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'address1',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.address'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'cellPhone',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.phone'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'status',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.status'
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
    this.deActiveMenu();

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

  //handle display submenu from list menu array by know which item active
  deActiveMenu() {
    this.sidebarService.deActivateDropdown('customers');
  }

  onAttachFiles(data: any[]): void {
    console.log('From customers all Page : ', data);

    for (let i = 0; i < data.length; i++) {
      this.data.push(data[i]);
    }

    // Refresh using Angular Router
    this.router
      .navigateByUrl('/modules/customers/allCustomers', {
        skipLocationChange: true,
      })
      .then(() => {
        this.router.navigate([this.router.url]);
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
        'customers/getFilteredCustomers',
        page ? page : 1,
        pageSize ? pageSize : 20
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value?.customerDto;
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
        .globalSearch('customers/globalsearch', event?.value, event?.column)
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
    this.apiService.delete('customers', deleteId).subscribe({
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
        'customers/getFilteredCustomers',
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
            this.data = data?.value?.customerDto;
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
  //change status
  onStatusChange(data: any) {
    let id = data?.id;
    let status = data?.status == 0 ? true : false;

    this.apiService
      .statusChange(`customers/updateStatus/${id}?status=${status}`, {})
      .subscribe({
        next: (data) => {
          console.log(data);
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

  // check page || components permissions
  checkPageActions(action: string): boolean {
    return this.permissionsService.checkPageActions(
      this.auth.currentUserSignal()?.userData,
      'CRMM2P1',
      action
    );
  }
}
