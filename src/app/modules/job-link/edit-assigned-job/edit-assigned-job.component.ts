import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-assigned-job',
  templateUrl: './edit-assigned-job.component.html',
  styleUrls: ['./edit-assigned-job.component.css'],
})
export class EditAssignedJobComponent implements OnInit, AfterViewInit {
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
  assignedJobId: any = null;
  currentJob: any = null;
  deleteId: any = null;

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
        this.assignedJobId = paramMap['get']('id');
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
      jobId: [''],
      inspectorNote: [['']],
      customerNote: [['']],
    });
    this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.minutes = ['00', '30'];
    this.durations = Array.from({ length: 47 }, (_, index) => 1 + index * 0.5);
  }
  ngAfterViewInit(): void {
    this.getCurrentData();
  }

  ngOnInit() {
    this.getTheme();
    this.getMembers();
    this.getCurrentActiveUser();
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

  getSelectedMembers(data: any) {
    this.selectedMembers = data?.checkedData;
    let ids = data?.checkedData?.map((item: any) => item?.id);
    this.addForm.patchValue({ teamIds: ids });
    console.log(ids, data?.checked, data?.id);

    if (data?.checked) {
      this.addNewMemeber(data?.id);
    } else if (data?.checked === false) {
      this.deleteMemeber(data?.id);
    }
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

  formatDate(date: string): any {
    var newDate: Date = new Date(date); // Parse the input date string

    const year = newDate.getFullYear(); // Get the year
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (1-based) and ensure 2 digits
    const day = newDate.getDate().toString().padStart(2, '0'); // Get the day and ensure 2 digits
    return `${year}-${month}-${day}`; // Return formatted date string
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('assignedJobs', this.assignedJobId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          let ids = data?.value?.teamIds?.map(
            (item: any) => item?.teamMemberId
          );
          //  set values
          this.addForm.patchValue({
            startDate: this.formatDate(data?.value?.startDate),
            durationBy: data?.value?.durationBy,
            hours: data?.value?.hours,
            minutes: data?.value?.minutes,
            meridiem: data?.value?.meridiem,
            duration: data?.value?.duration,
            endDate: this.formatDate(data?.value?.endDate),
            teamIds: ids,
            jobId: data?.value?.jobId,
          });
          this.currentJob = data?.value?.job;
          this.deleteId = data?.value?.id;

          this.members = this.getCheckedMembers(ids);
          console.log(ids);
          console.log(this.getCheckedMembers(ids));
          // check durationBy and set isDurationByHours
          data?.value?.durationBy == 'Hours'
            ? this.isDurationByHours == true
            : (this.isDurationByHours = false);
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
  getCheckedMembers(teamIds: string[]): any[] {
    return this.members.map((m: any) => {
      if (teamIds.includes(m?.id)) {
        return { ...m, checked: true };
      }
      return m;
    });
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
      };
      console.log(data);
      this.uploading = true;
      let assigned = false;
      // api
      this.apiService
        .update('assignedJobs', this.assignedJobId, data)
        .subscribe({
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
  unassignJob() {
    let assigned = false;
    this.apiService.delete('assignedJobs', this.deleteId).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          assigned = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم حذف العنصر بنجاح...');
          } else {
            this.toastr.success('item deleted successfully...');
          }
        }
      },
      error: (err) => {
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        if (assigned) {
          // update job to be assigned
          this.apiService
            .statusChange(
              `jobs/updateStatus/${
                this.addForm.get('jobId')?.value
              }?status=${true}`
            )
            .subscribe({
              next: (data) => {
                console.log(data);
                this.router.navigate(['/modules/jobLink'], {
                  queryParams: { view: 'Week' },
                });
              },
              error: (err: any) => {
                console.log('Error:', err);
                if (this.currentLanguage == 'ar') {
                  this.toastr.error('هناك شيء خاطئ', 'خطأ');
                } else {
                  this.toastr.error('There Is Somthing Wrong', 'Error');
                }
              },
            });
        }
      },
    });
  }
  deleteAssignedJob() {
    let assigned = false;
    this.apiService.delete('assignedJobs', this.deleteId).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          assigned = true;
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم حذف العنصر بنجاح...');
          } else {
            this.toastr.success('item deleted successfully...');
          }
          this.router.navigate(['/modules/jobLink'], {
            queryParams: { view: 'Week' },
          });
        }
      },
      error: (err) => {
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        if (assigned) {
          // update job to be assigned
          this.apiService
            .statusChange(
              `jobs/updateStatus/${
                this.addForm.get('jobId')?.value
              }?status=${true}`
            )
            .subscribe({
              next: (data) => {
                console.log(data);
                this.router.navigate(['/modules/jobLink'], {
                  queryParams: { view: 'Week' },
                });
              },
              error: (err: any) => {
                console.log('Error:', err);
                if (this.currentLanguage == 'ar') {
                  this.toastr.error('هناك شيء خاطئ', 'خطأ');
                } else {
                  this.toastr.error('There Is Somthing Wrong', 'Error');
                }
              },
            });
        }
      },
    });
  }

  addNewMemeber(memberId: any) {
    let data = {
      assignedJobId: this.assignedJobId,
      teamMemberId: memberId,
    };
    // add new member
    this.apiService.add(`assignedJobs/assignedJobMember/add`, data).subscribe({
      next: (data) => {
        console.log(data);
        if (this.currentLanguage == 'ar') {
          this.toastr.success('تمت إضافة العضو بنجاح...');
        } else {
          this.toastr.success('Member added successfully...');
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
    });
  }

  deleteMemeber(memberId: any) {
    // delete new member
    this.apiService
      .customDelete(
        `assignedJobs/assignedJobMember/delete?assignedJobId=${this.assignedJobId}&assignedMemberId=${memberId}`
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت حذف العضو بنجاح...');
          } else {
            this.toastr.success('Member deleted  successfully...');
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
      });
  }
}
