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
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class VehiclesComponent implements OnInit, AfterViewInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  data: any[] = [] as any[];
  loading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;
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
    // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
    this.dataKeys = [
      {
        name: 'vehicleNumber',
        display: this.translateService.instant(
          'inventory.vehicles.table.vehicle_number'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'teamMember',
        display: this.translateService.instant(
          'inventory.vehicles.table.assigned_technician'
        ),
        type: 'object',
        active: true,
      },
      {
        name: 'parts',
        display: this.translateService.instant(
          'inventory.vehicles.table.parts_quantity'
        ),
        type: 'object',
        active: true,
      },
      {
        name: 'tools',
        display: this.translateService.instant(
          'inventory.vehicles.table.tools_quantity'
        ),
        type: 'object',
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
    // api
    this.loading = true;
    this.apiService
      ?.filterData(
        'vehicles/getFilteredVehicles',
        page ? page : 1,
        pageSize ? pageSize : 20
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value?.vehicleDtos;
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
        .globalSearch('vehicles/globalsearch', event?.value, event?.column)
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
    this.apiService.delete('vehicles', deleteId).subscribe({
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
        'vehicles/getFilteredVehicles',
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
            this.data = data?.value?.VehicleDtos;
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
  //   console.log(data);
  //   let id = data?.id;
  //   let status = data?.status?.value;

  //   this.apiService
  //     .statusChange(`contracts/updateStatus/${id}?status=${status}`, {})
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
