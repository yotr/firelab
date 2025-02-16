import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-service-modal',
  templateUrl: './add-service-modal.component.html',
  styleUrls: ['./add-service-modal.component.css'],
})
export class AddServiceModalComponent implements OnInit {
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  // services
  services: any[] = [];
  servicesLoading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;

  uploading: boolean = false;

  selectedServices: any = null;
  currentPage: number = 1;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getServices();
  }

  // on selecte teamMember
  onSelect(event: any) {
    console.log(event);
    this.selectedServices = event;
  }
  // get Services data
  getServices(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'services/getFilteredServices',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.services = data?.value?.services;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.servicesLoading = false;
        },
        error: (err: any) => {
          this.servicesLoading = false;
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
  // get data
  getDataEnd(page?: number, pageSize?: number) {
    this.servicesLoading = true;
    // api
    this.apiService
      .filterData(
        'services/getFilteredServices',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.services = [...this.services, ...data?.value?.services];
            //  this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.servicesLoading = false;
        },
        error: (err: any) => {
          this.servicesLoading = false;
          this.getDataError = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {
          this.servicesLoading = false;
        },
      });
  }
  loadMore() {
    this.currentPage++;
    this.getDataEnd(this.currentPage);
  }
  onFilter(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('services/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.services = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.servicesLoading = false;
          },
          error: (err: any) => {
            this.servicesLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getServices();
    }
  }

  submit() {
    console.log(this.selectedServices);
    this.onAdd.emit(this.selectedServices);
  }
}
