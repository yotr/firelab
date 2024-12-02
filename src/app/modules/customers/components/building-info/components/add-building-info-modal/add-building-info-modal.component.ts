import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
declare const $: any;

@Component({
  selector: 'app-add-building-info-modal',
  templateUrl: './add-building-info-modal.component.html',
  styleUrls: ['./add-building-info-modal.component.css'],
})
export class AddBuildingInfoModalComponent implements OnInit {
  @Input() customerId: any = null;
  @Input() currentTheme: any;
  @Input() currentLanguage: any = localStorage.getItem('lang');
  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  addForm: FormGroup;
  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    // update form
    this.addForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit() {}
  submit() {
    if (this.addForm.valid) {
      let data = {
        customerId: this.customerId,
        ...this.addForm.value,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('CustomerBindingInfo/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            $('#add_building_info_modal').modal('hide');
          }
        },
        error: (err: any) => {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
          this.uploading = false;
        },
        complete: () => {
          this.uploading = false;
        },
      });
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }
}
