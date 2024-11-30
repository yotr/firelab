import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-report-device-modal',
  templateUrl: './add-report-device-modal.component.html',
  styleUrls: ['./add-report-device-modal.component.css'],
})
export class AddReportDeviceModalComponent implements OnInit {
  currentTheme: any;
  addForm: FormGroup;
  reportId: any = null;

  // types
  types: any[] = [];
  typesLoading: boolean = true;
  activeStatus: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private formBuilder: FormBuilder,
    private themeService: ThemeService
  ) {
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.reportId = paramMap['get']('id');
      }
    });
    // add form
    this.addForm = this.formBuilder.group({
      device: ['', [Validators.required]],
      floor: ['', [Validators.required]],
      address: ['', [Validators.required]],
      location: ['', [Validators.required]],
      make: ['', [Validators.required]],
      modal: ['', [Validators.required]],
      status: ['', [Validators.required]],
      note: ['', [Validators.required]],
    });

    this.types = [
      {
        id: 0,
        name: 'Bell',
      },
      {
        id: 1,
        name: 'Door Holder',
      },
      {
        id: 2,
        name: 'Door Lock',
      },
    ];
  }

  ngOnInit() {
    this.getTheme();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  setStatus(status: any) {
    this.activeStatus = status;
  }

  submit() {
    let date = new Date();
    // add the new date
    // this.addUserForm.patchValue({
    //   date: date.toLocaleDateString('en-CA'),
    // });

    // // add to server
    // if (this.addUserForm.valid) {
    //   let formData: FormData = new FormData();
    //   formData.append('firstName', this.addUserForm.get('firstName').value);
    //   formData.append('lastName', this.addUserForm.get('lastName').value);
    //   formData.append('userName', this.addUserForm.get('userName').value);
    //   formData.append('email', this.addUserForm.get('email').value);
    //   formData.append('password', this.addUserForm.get('password').value);
    //   formData.append(
    //     'confirmPassword',
    //     this.addUserForm.get('confirmPassword').value
    //   );
    //   formData.append('phone', this.addUserForm.get('phone').value);
    //   formData.append('role', this.addUserForm.get('role').value);
    //   // formData.append('company', this.addUserForm.get('company').value);
    //   if (this.addUserForm.get('employeeId').value !== null) {
    //     formData.append('employeeId', this.addUserForm.get('employeeId').value);
    //   }
    //   if (this.addUserForm.get('clientId').value !== null) {
    //     formData.append('clientId', this.addUserForm.get('clientId').value);
    //   }

    //   formData.append('date', this.addUserForm.get('date').value);
    //   // formData.append('permissions', JSON.stringify(this.defaultPermissions));
    //   if (this.addUserForm.get('image').value != null) {
    //     formData.append('image', this.addUserForm.get('image').value);
    //   }

    //   let added = false;
    //   this.uploading = true;
    //   // send the data to server
    //   this.apiService.addMultiData('users/create', formData).subscribe({
    //     next: (data) => {
    //       this.uploading = false;
    //       added = true;
    //     },
    //     error: (error) => {
    //       this.uploading = false;
    //       this.toastr.error('there is something wrong', 'Error');
    //     },
    //     complete: () => {
    //       if (added) {
    //         this.uploading = false;
    //         this.router.navigate(['/modules/users/all-users']);
    //         this.toastr.success('User added Successfully');
    //         this.addUserForm.reset();
    //       }
    //     },
    //   });
    // } else {
    //   this.uploading = false;
    //   this.toastr.error('', 'Please enter mandatory field!');
    // }
  }
}
