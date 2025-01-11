import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-assign-tools-modal',
  templateUrl: './assign-tools-modal.component.html',
  styleUrls: ['./assign-tools-modal.component.css'],
})
export class AssignToolsModalComponent implements OnInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  // tools
  tools: any[] = [];
  toolsLoading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;

  uploading: boolean = false;

  selectedTool: any = null;

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
    });
  }

  ngOnInit() {
    this.getTools();
  }

  // on selecte teamMember
  onSelectTool(event: any) {
    console.log(event);
    this.selectedTool = event;
    this.addForm.patchValue({
      id: event?.id,
    });
  }
  // get tools data
  getTools(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'Tools/getFilteredTools',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.tools = data?.value?.tools;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.toolsLoading = false;
        },
        error: (err: any) => {
          this.toolsLoading = false;
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
  onFilterTools(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('Tools/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.tools = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.toolsLoading = false;
          },
          error: (err: any) => {
            this.toolsLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getTools();
    }
  }

  //add a new
  submit() {
    if (this.addForm.valid) {
      if (
        this.selectedTool?.quantity - this.selectedTool?.vehicleQty >=
        this.addForm.get('quantity')?.value
      ) {
        let addData = {
          ...this.selectedTool,
          ...this.addForm.value,
        };
        $('#add_tools_modal').modal('hide');
        this.onAdd.emit(addData);

        // let updateData = {
        //   isAdd: true,
        //   quantity: this.addForm.get('quantity')?.value,
        // };

        //   this.uploading = true;
        //   // api
        //   this.apiService
        //     .update('tools/updateQty', this.selectedTool?.id, updateData)
        //     .subscribe({
        //       next: (data) => {
        //         console.log(data);
        //         if (data?.isSuccess) {
        //           if (this.currentLanguage == 'ar') {
        //             this.toastr.success('تمت إضافة البيانات بنجاح...');
        //           } else {
        //             this.toastr.success('data added successfully...', 'Success');
        //           }
        //         }
        //       },
        //       error: (err: any) => {
        //         if (this.currentLanguage == 'ar') {
        //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
        //         } else {
        //           this.toastr.error('There Is Somthing Wrong', 'Error');
        //           this.toastr.error(err?.error[0]?.message, 'Error');
        //         }
        //         this.uploading = false;
        //       },
        //       complete: () => {
        //         this.uploading = false;
        //         this.onAdd.emit(addData);
        //       },
        //     });
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
