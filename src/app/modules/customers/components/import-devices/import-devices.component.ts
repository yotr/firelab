import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-import-devices',
  templateUrl: './import-devices.component.html',
  styleUrls: ['./import-devices.component.css'],
})
export class ImportDevicesComponent implements OnInit, AfterViewInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  data: any[] = [] as any[];
  loading: boolean = true;
  totalItemsCount: number = 0;
  dataKeys: any[] = [];
  // current logged in user
  currentUser: any = {} as any;
  customerId: any = null;

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService,
    private sidebarService: SidebarService
  ) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
      }
    });

    //   // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);

    this.dataKeys = [
      {
        name: 'reportCategory',
        display: this.translateService.instant(
          'customers.import_devices.table.reportCategory'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'listName',
        display: this.translateService.instant(
          'customers.import_devices.table.listName'
        ),
        type: 'string',
        active: true,
      },
    ];
  }

  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    this.getData();
    this.getCurrentCustomerId();
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
  setActiveMenu() {
    this.sidebarService.activateDropdown('1');
  }

  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    if (this.customerId != null) {
      this.setActiveMenu();
      // set querys to current page
      this.router.navigate([], {
        queryParams: { customerId: this.customerId },
      });
    } else {
      this.router.navigate(['/modules/customers/allCustomers']);
    }
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
    this.loading = false;
    this.totalItemsCount = this.data.length;

    // api
    // this.apiService
    //   ?.filterData(
    //     'devices/getFilteredDevices',
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
        .globalSearch('devices/globalsearch', event?.value, event?.column)
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
    this.apiService.delete('devices', deleteId).subscribe({
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
        'devices/getFilteredDevices',
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
  navigate(path: any) {
    this.router.navigate([path], {
      queryParams: { customerId: this.customerId },
    });
  }
}
