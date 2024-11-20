import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css'],
})
export class AllCustomersComponent implements OnInit {
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
    // public apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService,
    private sidebarService: SidebarService
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
    // this.translateService.instant('clients.client_table.client_id');
    this.dataKeys = [
      {
        name: 'companyName',
        display: 'Company Name',
        type: 'string',
        active: true,
      },
      {
        name: 'ID',
        display: 'ID/Account',
        type: 'string',
        active: true,
      },
      {
        name: 'address',
        display: 'Address',
        type: 'string',
        active: true,
      },
      {
        name: 'phone',
        display: 'Phone',
        type: 'string',
        active: true,
      },
      {
        name: 'status',
        display: 'Status',
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
