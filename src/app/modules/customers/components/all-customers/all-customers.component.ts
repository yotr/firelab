import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

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
    // private permissionsService: PermissionsService,
    private auth: AuthService,
    private sidebarService: SidebarService
  ) {
    //   // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);

    this.dataKeys = [
      {
        name: 'companyName',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.companyName'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'ID',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.id'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'address',
        display: this.translateService.instant(
          'customers.all_customers.customers_table.address'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'phone',
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

  onAttachFiles(files: any): void {
    // this.attachedFiles = files;
    // this.addFileForm.patchValue({
    //   files: this.attachedFiles,
    // });
    console.log(files);
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
        id: 1,
        companyName: 'Test Company One',
        ID: 'Test',
        address: 'Test Address',
        phone: '7890574534',
        status: false,
        checked: false,
      },
      {
        id: 2,
        companyName: 'Test Company Two',
        ID: 'Test',
        address: 'Test Address',
        phone: '7890574534',
        status: false,
        checked: false,
      },
    ];

    this.loading = false;
    this.totalItemsCount = this.data.length;

    // api
    // this.apiService
    //   ?.filterData(
    //     'customers/getFilteredCustomers',
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
        .globalSearch('customers/globalsearch', event?.value, event?.column)
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
    this.apiService.delete('customers', deleteId).subscribe({
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
        'customers/getFilteredCustomers',
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
      .statusChange(`customers/updateStatus?status=${status}`, id, {})
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
