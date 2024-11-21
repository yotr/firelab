import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-recurring-inspections',
  templateUrl: './add-recurring-inspections.component.html',
  styleUrls: ['./add-recurring-inspections.component.css'],
})
export class AddRecurringInspectionsComponent implements OnInit {
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
  // reports
  reports: any[] = [];
  reportsLoading: boolean = true;
  // frequency
  frequencies: any[] = [];
  frequencyLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  isPricesAdded: boolean = false;
  isTasksAdded: boolean = false;

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
    this.addForm = this.formBuilder.group({
      reportCategory: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      year: ['', [Validators.email]],
      firstPrice: [''],
      secondPrice: [''],
      thirdPrice: [''],
      forthPrice: [''],
      // tasks
      tasks: this.formBuilder.array([]),
    });
    this.reports = [
      {
        id: 0,
        name: 'Alarm',
      },
      {
        id: 1,
        name: 'Fire Door',
      },
    ];
    this.frequencies = [
      {
        id: 0,
        name: 'Weekly',
      },
      {
        id: 1,
        name: 'Bi Weekly',
      },
      {
        id: 2,
        name: 'Monthly',
      },
      {
        id: 3,
        name: 'Bi Monthly',
      },
      {
        id: 4,
        name: 'Quarterly',
      },
      {
        id: 5,
        name: 'Semi Annual',
      },
      {
        id: 6,
        name: 'Annual',
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
  togglePrices() {
    this.isPricesAdded = !this.isPricesAdded;
  }

  get tasks(): FormArray {
    return this.addForm.get('tasks') as FormArray;
  }

  newTaskItem(): FormGroup {
    return this.formBuilder.group({
      description: '',
      frequency: '',
      date: '',
    });
  }
  emptyTasks(): FormGroup {
    return this.formBuilder.group({});
  }

  addTaskItem() {
    this.tasks.push(this.newTaskItem());
  }
  //removing rows from table
  removeTaskItems(i: any) {
    this.tasks.removeAt(i);
  }
  onCheck(event: any) {
    let value = event.target.checked;
    let tasks: any[] = this.tasks.value;
    if (value) {
      this.isTasksAdded = true;
      this.addTaskItem();
    } else {
      this.isTasksAdded = false;
      tasks.forEach((item, index) => {
        this.removeTaskItems(index);
      });
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
