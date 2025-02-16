import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-deficiency-modal',
  templateUrl: './add-deficiency-modal.component.html',
  styleUrls: ['./add-deficiency-modal.component.css'],
})
export class AddDeficiencyModalComponent implements OnInit {
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  // deficiencies
  currentPage: number = 1;
  deficiencies: any[] = [];
  deficienciesLoading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;

  uploading: boolean = false;

  selectedDeficiency: any = null;

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.getDeficiencies();
  }

  // on selecte teamMember
  onSelect(event: any) {
    console.log(event);
    this.selectedDeficiency = event;
  }
  // get deficiencies data
  getDeficiencies(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'deficiencies/getFilteredDeficiencies',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.deficiencies = data?.value?.deficiencies;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.deficienciesLoading = false;
        },
        error: (err: any) => {
          this.deficienciesLoading = false;
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
  getDeficienciesEnd(page?: number, pageSize?: number) {
    this.deficienciesLoading = true;
    // api
    this.apiService
      .filterData(
        'deficiencies/getFilteredDeficiencies',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.deficiencies = [
              ...this.deficiencies,
              ...data?.value?.deficiencies,
            ];
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.deficienciesLoading = false;
        },
        error: (err: any) => {
          this.deficienciesLoading = false;
          this.getDataError = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {
          this.deficienciesLoading = false;
        },
      });
  }
  loadMore() {
    this.currentPage++;
    this.getDeficienciesEnd(this.currentPage);
  }
  onFilter(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('deficiencies/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.deficiencies = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.deficienciesLoading = false;
          },
          error: (err: any) => {
            this.deficienciesLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getDeficiencies();
    }
  }

  submit() {
    console.log(this.selectedDeficiency);
    this.onAdd.emit(this.selectedDeficiency);
  }
}
