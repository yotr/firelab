import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-customers-Deficiencies',
  templateUrl: './customers-Deficiencies.component.html',
  styleUrls: ['./customers-Deficiencies.component.css'],
})
export class CustomersDeficienciesComponent implements OnInit, AfterViewInit {
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
    // public apiService: ApiService,
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
    // this.translateService.instant('clients.client_table.client_id');
    this.dataKeys = [
      {
        name: 'category',
        display: 'Category',
        type: 'string',
        active: true,
      },
      {
        name: 'date',
        display: 'Date',
        type: 'string',
        active: true,
      },
      {
        name: 'status',
        display: 'Status',
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
    this.sidebarService.activateDropdown('customers');
  }
  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    this.setActiveMenu();
    // set querys to current page
    // this.router.navigate([], {
    //   queryParams: { customerId: this.customerId },
    // });
  }
  // navigationHandler() {
  //   this.router.events.subscribe((event: Event) => {
  //     if (event instanceof NavigationEnd) {
  //       if (
  //         event.url.includes('/customers/home') ||
  //         event.url.includes('/customers/owner') ||
  //         event.url.includes('/customers/customerInfo') ||
  //         event.url.includes('/customers/buildingInfo') ||
  //         event.url.includes('/customers/systemInfo')
  //       ) {
  //         this.getCurrentCustomerId();
  //       }
  //     }
  //   });
  // }

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
    this.loading = false;
    this.totalItemsCount = this.data.length;
    // this.apiService
    //   .filterData(
    //     `clients/getFilteredClients`,
    //     page ? page : 1,
    //     pageSize ? pageSize : 10
    //   )
    //   .subscribe((data) => {
    //     this.clients = data?.clientDto;
    //     this.totalItemsCount = data?.totalCount;
    //     this.loading = false;
    //     // get dynamic columns keys
    //     // this.getTableTabKeys(data);
    //   });
  }

  // search(event: any) {
  //   if (event?.value != null && event.value?.trim() != '') {
  //     this.apiService
  //       .globalSearch('clients/globalsearch', event?.value, event?.column)
  //       .subscribe((data) => {
  //         // console.log(data);
  //         this.clients = data;
  //         this.totalItemsCount = data?.length;
  //         this.loading = false;
  //       });
  //   } else {
  //     this.getClients();
  //   }
  // }

  // delete(deleteId: any) {
  //   console.log(deleteId);
  //   this.apiService.delete('clients', deleteId).subscribe({
  //     next: () => {
  //       // delete in client side when success
  //       this.clients = this.clients.filter((data) => data?.id !== deleteId);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {
  //       //success message
  //       this.toastr.success('Client', 'Deleted Successfully', {
  //         timeOut: 3000,
  //       });
  //     },
  //   });
  // }
  // //filters handle
  // handleFiltersSubmit(event: any) {
  //   this.loading = true;
  //   // check if filters operator  contains selected
  //   this.apiService
  //     .filterData(
  //       'clients/getFilteredClients',
  //       1,
  //       10,
  //       event?.column,
  //       event?.filters?.operator1,
  //       event?.filters?.operator2,
  //       event?.filters?.searchValue1,
  //       event?.filters?.searchValue2
  //     )
  //     .subscribe((result) => {
  //       this.clients = result?.clientDto;
  //       this.totalItemsCount = result?.totalCount;
  //       this.loading = false;
  //     });
  // }
  // //delete selected
  // deleteSelected() {
  //   //success message
  //   this.toastr.success('Client Deleted Successfully...', 'Success');
  //   //in server side
  // }
  // resetData() {
  //   this.getClients();
  // }
  // //change status
  // onStatusChange(data: any) {
  //   data.client.status = data.status;
  //   data.client.checked = false;
  //   // update status of leave
  //   let formData: FormData = new FormData();
  //   formData.append('email', data.client.email);
  //   // formData.append('password', data.client.password);
  //   // formData.append('confirmPassword', data.client.confirmPassword);
  //   formData.append('firstName', data.client.firstName);
  //   formData.append('lastName', data.client.lastName);
  //   formData.append('clientId', data.client.clientId);
  //   formData.append('mobile', data.client.phone);
  //   formData.append('companyName', data.client.companyName);
  //   // formData.append('permissions', JSON.stringify(data.client.permissions));
  //   formData.append('status', data.client.status);

  //   let updated = false;
  //   this.apiService
  //     .update('clients/update', data?.client?.id, formData)
  //     .subscribe({
  //       next: () => {
  //         updated = true;
  //       },
  //       error: () => {
  //         this.toastr.error('There Is Somthing Wrong', 'Error');
  //       },
  //       complete: () => {
  //         if (updated) {
  //           //success
  //           this.toastr.success(`Status Changed Successfully...`, 'Success');
  //         }
  //       },
  //     });
  // }
  // // check page || components permissions
  // checkPageActions(action: string): boolean {
  //   return this.permissionsService.checkPageActions(
  //     this.auth.currentUserSignal()?.userData,
  //     'Clients',
  //     action
  //   );
  // }
  //handle display submenu from list menu array by know which item active
  // setActiveMenu() {
  //   this.sidebarService.sendActiveDropdown('Customers');
  // }
}
