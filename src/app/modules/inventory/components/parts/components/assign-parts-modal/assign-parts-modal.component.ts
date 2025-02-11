import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;
@Component({
  selector: 'app-assign-parts-modal',
  templateUrl: './assign-parts-modal.component.html',
  styleUrls: ['./assign-parts-modal.component.css'],
})
export class AssignPartsModalComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  // suppliers
  suppliers: any[] = [];
  suppliersLoading: boolean = true;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  CategoriesGetDataError: boolean = false;
  // parts
  parts: any[] = [];
  partsLoading: boolean = true;
  partsGetDataError: boolean = false;

  uploading: boolean = false;

  selectedPart: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      id: [null, [Validators.required]],
      quantity: [0, [Validators.required]],
      // supplierId: [null, [Validators.required]],
      // reportCategoryId: [null, [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    // this.getSuppliers();
  }

  ngOnInit() {
    // this.getCategories();
    this.getParts();
  }

  // getCategories() {
  //   this.apiService.get('reportCategories').subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //       if (data?.isSuccess) {
  //         this.categories = data?.value;
  //         this.CategoriesGetDataError = false;
  //       }
  //       this.categoriesLoading = false;
  //     },
  //     error: (err) => {
  //       this.categories = [];
  //       this.categoriesLoading = false;
  //       this.CategoriesGetDataError = true;
  //       console.log(err);
  //       if (this.currentLanguage == 'ar') {
  //         this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //       } else {
  //         this.toastr.error('There Is Somthing Wrong', 'Error');
  //       }
  //       this.categoriesLoading = false;
  //     },
  //     complete: () => {
  //       this.categoriesLoading = false;
  //     },
  //   });
  // }

  // on select
  // onSelectCategory(event: any) {
  //   console.log(event);
  //   this.addForm.patchValue({
  //     reportCategoryId: event?.id,
  //   });
  // }
  // onFilterCategories(value: string) {
  //   if (value != null && value?.trim() != '') {
  //     this.categories = this.categories.filter((item) =>
  //       item.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //   } else {
  //     this.getCategories();
  //   }
  // }
  // on select
  onSelectPart(event: any) {
    console.log(event);
    this.selectedPart = event;
    this.addForm.patchValue({
      id: event?.id,
    });
  }
  // get Parts data
  getParts(page?: number, pageSize?: number) {
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
            this.parts = data?.value?.parts;
            // this.totalItemsCount = data?.value?.totalCount;
            this.partsGetDataError = false;
          }
          this.partsLoading = false;
        },
        error: (err: any) => {
          this.partsLoading = false;
          this.partsGetDataError = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
        },
        complete: () => {},
      });
  }
  onFilterParts(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('Parts/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.parts = data?.value;
              // this.totalItemsCount = data?.value?.length;
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
  // on select
  // onSelectSupplier(event: any) {
  //   console.log(event);
  //   this.addForm.patchValue({
  //     supplierId: event?.id,
  //   });
  // }
  // get Suppliers data
  // getSuppliers(page?: number, pageSize?: number) {
  //   // api
  //   this.apiService
  //     .filterData(
  //       'Suppliers/getFilteredSuppliers',
  //       page ? page : 1,
  //       pageSize ? pageSize : 10
  //     )
  //     .subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         if (data?.isSuccess) {
  //           this.suppliers = data?.value?.suppliers;
  //           // this.totalItemsCount = data?.value?.totalCount;
  //           // this.partsGetDataError = false;
  //         }
  //         this.suppliersLoading = false;
  //       },
  //       error: (err: any) => {
  //         this.suppliersLoading = false;
  //         // this.partsGetDataError = true;
  //         if (this.currentLanguage == 'ar') {
  //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //         } else {
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         }
  //       },
  //       complete: () => {},
  //     });
  // }
  // onFilterSuppliers(value: string) {
  //   if (value != null && value?.trim() != '') {
  //     this.apiService
  //       .globalSearch('Suppliers/globalsearch', value, null)
  //       .subscribe({
  //         next: (data: any) => {
  //           console.log(data);
  //           if (data?.isSuccess) {
  //             this.suppliers = data?.value;
  //             // this.totalItemsCount = data?.value?.length;
  //           }
  //           this.suppliersLoading = false;
  //         },
  //         error: (err: any) => {
  //           this.suppliersLoading = false;
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         },
  //       });
  //   } else {
  //     this.getSuppliers();
  //   }
  // }

  //add a new
  submit() {
    if (this.addForm.valid) {
      if (
        this.selectedPart?.quantity - this.selectedPart?.vehicleQty >=
          this.addForm.get('quantity')?.value &&
        this.addForm.get('qty')?.value != 0
      ) {
        let addData = {
          ...this.selectedPart,
          ...this.addForm.value,
        };
        $('#add_parts_modal').modal('hide');
        this.onAdd.emit(addData);
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
}
