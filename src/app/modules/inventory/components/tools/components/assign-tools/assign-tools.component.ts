import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-assign-tools',
  templateUrl: './assign-tools.component.html',
  styleUrls: ['./assign-tools.component.css'],
})
export class AssignToolsComponent implements OnInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentUser: any = null;
  // users
  users: any[] = [];
  usersLoading: boolean = true;
  // vehicles
  vehicles: any[] = [];
  vehiclesLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;

  parts: any[] = [];
  partsKeys: any[] = [];
  partsLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    public translateService: TranslateService,
    // private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      vehicleNumber: ['', [Validators.required]],
      assignedTechnician: ['', [Validators.required]],
    });
    this.users = [
      {
        id: 1,
        name: 'Test User',
      },
    ];
    this.vehicles = [
      {
        id: 1,
        name: '7843',
      },
      {
        id: 2,
        name: '74835',
      },
    ];

    this.partsKeys = [
      {
        name: 'tool',
        display: this.translateService.instant(
          'inventory.tools.assign.table.tool'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'idNumber',
        display: this.translateService.instant(
          'inventory.tools.assign.table.id_number'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'quantity',
        display: this.translateService.instant(
          'inventory.tools.assign.table.quantity'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'description',
        display: this.translateService.instant(
          'inventory.tools.assign.table.description'
        ),
        type: 'string',
        active: true,
      },
    ];
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
    let user = localStorage.getItem('firelab-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
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
