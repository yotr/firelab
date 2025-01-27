import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css'],
})
export class AddItemModalComponent implements OnInit {
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  // items
  items: any[] = [];
  itemsLoading: boolean = true;
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
    this.getItems();
  }

  // on selecte teamMember
  onSelect(event: any) {
    console.log(event);
    this.selectedDeficiency = event;
  }
  // get data
  getItems(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'Items/getFilteredItems',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.items = data?.value?.items;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.itemsLoading = false;
        },
        error: (err: any) => {
          this.itemsLoading = false;
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
  onFilter(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('Items/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.items = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.itemsLoading = false;
          },
          error: (err: any) => {
            this.itemsLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getItems();
    }
  }

  submit() {
    console.log(this.selectedDeficiency);
    this.onAdd.emit(this.selectedDeficiency);
  }
}
