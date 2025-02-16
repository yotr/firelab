import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-part-modal',
  templateUrl: './add-part-modal.component.html',
  styleUrls: ['./add-part-modal.component.css'],
})
export class AddPartModalComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  // parts
  parts: any[] = [];
  partsLoading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;

  uploading: boolean = false;

  selectedParts: any = null;
  currentPage: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      partId: [null, [Validators.required]],
      qty: [0, [Validators.required]],
      rate: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.getParts();
  }

  ngOnInit() {}

  // on selecte teamMember
  onSelect(event: any) {
    console.log(event);
    this.selectedParts = event;
    this.addForm.patchValue({
      name: event?.partName,
      partId: event?.id,
      rate: event?.cost,
      quantity: event?.quantity,
    });
  }
  // get parts data
  getParts(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'parts/getFilteredParts',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.parts = data?.value?.parts;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.partsLoading = false;
        },
        error: (err: any) => {
          this.partsLoading = false;
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
    this.partsLoading = true;
    // api
    this.apiService
      .filterData(
        'Parts/getFilteredParts',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.parts = [...this.parts, ...data?.value?.parts];
            //  this.totalItemsCount = data?.value?.totalCount;
            // this.partsGetDataError = false;
          }
          this.partsLoading = false;
        },
        error: (err: any) => {
          this.partsLoading = false;
          // this.partsGetDataError = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {
          this.partsLoading = false;
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
        .globalSearch('parts/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.parts = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.partsLoading = false;
          },
          error: (err: any) => {
            this.partsLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getParts();
    }
  }

  submit() {
    if (this.addForm.valid) {
      if (
        this.selectedParts?.quantity - this.selectedParts?.vehicleQty >=
          this.addForm.get('qty')?.value &&
        this.addForm.get('qty')?.value != 0
      ) {
        // let partId = this.addForm.get('partId')?.value;
        // let newPartQty =
        //   this.selectedParts?.quantity - this.addForm.get('qty')?.value;
        // this.updatePartQuantity(partId, newPartQty);
        this.onAdd.emit({ ...this.addForm.value });
      } else {
        if (this.currentLanguage == 'ar') {
          this.toastr.warning('الرجاء إدخال الكمية الصحيحة');
        } else {
          this.toastr.warning('Please enter valid quantity');
        }
      }
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }

  updatePartQuantity(id: any, qty: number) {
    // update
    this.apiService.update(`parts/updateQty`, id, qty).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم تحديث العنصر بنجاح...');
          } else {
            this.toastr.success('item updated successfully...');
          }
        }
      },
      error: (err: any) => {
        console.log('Error:', err);
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
