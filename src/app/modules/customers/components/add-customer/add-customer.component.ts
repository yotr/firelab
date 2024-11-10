import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  addForm: FormGroup;
  loading: boolean = true;
  // employees: any[] = [];
  // employeesLoading: boolean = true;
  // clients: any[] = [];
  // clientsLoading: boolean = true;
  defaultImgUrl: any = 'assets/img/camera.png';
  currentTheme: any;
  selectUserType: string = 'normal';

  currentUser: any = null;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    // private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group(
      {
        // customer
        customerBusinessName: ['', [Validators.required]],
        customerContactName: [''],
        customerEmail: ['', [Validators.email]],
        customerCellPhone: [''],
        customerOfficePhone: [''],
        customerContactFaxNumber: [''],
        customerId: [''],
        customerAddress1: [''],
        customerAddress2: [''],
        customerPostalCode: [''],
        customerCity: [''],
        // owner
        ownerBusinessName: ['', [Validators.required]],
        ownerContactName: [''],
        ownerEmail: ['', [Validators.email]],
        ownerCellPhone: [''],
        ownerOfficePhone: [''],
        ownerContactFaxNumber: [''],
        ownerId: [''],
        ownerAddress1: [''],
        ownerAddress2: [''],
        ownerPostalCode: [''],
        ownerCity: [''],
      }
      // { validators: passwordMatch }
    );
  }
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getTheme();
    this.getCurrentActiveUser();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  //add a new
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
  trackFun(index: number, item: any): number {
    return item.id;
  }
  // check page || components permissions
  checkPageActions(): any {
    // return this.permissionsService.checkPageActions(
    //   this.auth.currentUserSignal()?.userData,
    //   'Users',
    //   'add'
    // );
  }
}
