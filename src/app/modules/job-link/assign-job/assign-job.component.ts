import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-assign-job',
  templateUrl: './assign-job.component.html',
  styleUrls: ['./assign-job.component.css'],
})
export class AssignJobComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  hours: any[] = [];
  minutes: any[] = [];
  durations: any[] = [];
  // employees: any[] = [];
  // employeesLoading: boolean = true;
  // clients: any[] = [];
  // clientsLoading: boolean = true;
  defaultImgUrl: any = 'assets/img/camera.png';
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  selectUserType: string = 'normal';
  // members
  members: any[] = [];
  membersLoading: boolean = true;
  totalItemsCount: number = 0;
  selectedMembers: any[] = [];

  currentUser: any = null;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  isNoteActive: boolean = false;
  isInspectorNoteActive: boolean = false;
  isCustomerNoteActive: boolean = false;
  currentJob: any = null;
  jobId: any = null;

  // for durationBy and end date
  isDurationByHours: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.jobId = paramMap['get']('id');
      }
    });

    // Add form
    this.addForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      durationBy: ['Hours', [Validators.required]],
      hours: ['', [Validators.required]],
      minutes: ['', [Validators.required]],
      meridiem: ['', [Validators.required]],
      duration: [0],
      endDate: [''],
      teamIds: [[], [Validators.required]],
      external: ['false'],
      customerApproved: ['false'],
      inspectorNote: [['']],
      customerNote: [['']],
      deficiencyIds: this.formBuilder.array([]),
    });
    this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.minutes = ['00', '30'];
    this.durations = Array.from({ length: 47 }, (_, index) => 1 + index * 0.5);
  }

  get formValues() {
    return this.addForm.controls;
  }

  get deficiencyIds(): FormArray {
    return this.addForm.get('deficiencyIds') as FormArray;
  }

  // get items comeing from data
  addExistingItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.deficiency?.name,
      });
      this.deficiencyIds.push(value);
    });
  }

  ngAfterViewInit(): void {
    this.getMembers();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentActiveUser();
    this.getCurrentJob();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  toggleNote() {
    this.isNoteActive = !this.isNoteActive;
  }
  close() {
    this.isNoteActive = false;
  }
  addInspectorNote() {
    this.isInspectorNoteActive = true;
  }
  removeInspectorNote() {
    this.addForm.get('inspectorNote')?.setValue('');
    this.isInspectorNoteActive = false;
  }
  addCustomerNote() {
    this.isCustomerNoteActive = true;
  }
  removeCustomerNote() {
    this.addForm.get('customerNote')?.setValue('');
    this.isCustomerNoteActive = false;
  }

  onDurationChange(event: any) {
    let value = event?.target?.value;

    value === 'Hours'
      ? (this.isDurationByHours = true)
      : (this.isDurationByHours = false);
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

  // get members data
  getMembers() {
    // api
    this.apiService.get('teamMembers').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.members = data?.value;
          this.totalItemsCount = data?.value?.length;
          // this.getDataError = false;
        }
        this.membersLoading = false;
      },
      error: (err: any) => {
        this.membersLoading = false;
        // this.getDataError = true;
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {},
    });
  }

  getSelectedMembers(members: any) {
    this.selectedMembers = members?.checkedData;
    let ids = members?.checkedData?.map((item: any) => item?.id);
    this.addForm.patchValue({ teamIds: ids });
  }

  // get current data
  getCurrentJob() {
    this.apiService.getById('jobs', this.jobId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          //  set values
          this.currentJob = data?.value;
          this.addExistingItems(data?.value?.assignedDeficiencies);
        }
      },
      error: (error) => {
        console.log(error);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
    });
  }

  trackFun(index: number, item: any): number {
    return item.id;
  }
  back() {
    this.router.navigate(['/modules/jobLink'], {
      queryParams: { view: 'Week' },
    });
  }
  delete() {
    this.addForm.reset();
  }

  submit() {
    let date = new Date();
    console.log(this.selectedMembers);
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
        startDate: new Date(
          this.addForm.get('startDate')?.value
        )?.toISOString(),
        endDate: this.isDurationByHours
          ? null
          : new Date(this.addForm.get('endDate')?.value)?.toISOString(),
        jobId: this.jobId,
        external: this.addForm.get('external')?.value == 'true' ? true : false,
        customerApproved: this.addForm.get('customerApproved')?.value == 'true' ? true : false,
      };
      console.log(data);
      this.uploading = true;
      let assigned = false;
      // api
      this.apiService.add('assignedJobs/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            assigned = true;
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/jobLink'], {
              queryParams: { view: 'Week' },
            });
          }
        },
        error: (err: any) => {
          console.log('Error:', err);
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
          }
          this.uploading = false;
        },
        complete: () => {
          this.uploading = false;
          // if (assigned) {
          //   // update job to be assigned
          //   this.apiService
          //     .statusChange(`jobs/updateStatus/${this.jobId}?status=${true}`)
          //     .subscribe({
          //       next: (data) => {
          //         console.log(data);
          //       },
          //       error: (err: any) => {
          //         console.log('Error:', err);
          //         if (this.currentLanguage == 'ar') {
          //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
          //         } else {
          //           this.toastr.error('There Is Somthing Wrong', 'Error');
          //         }
          //       },
          //     });
          // }
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
