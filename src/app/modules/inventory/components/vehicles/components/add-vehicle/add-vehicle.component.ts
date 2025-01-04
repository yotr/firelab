import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
})
export class AddVehicleComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  // members
  members: any[] = [];
  membersLoading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;

  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      vehicleNumber: ['', [Validators.required]],
      teamMemberId: [null, [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    this.getMembers();
  }

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

  // on selecte teamMember
  onSelectTeamMember(teamMember: any) {
    this.addForm.patchValue({
      teamMemberId: teamMember?.id,
    });
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }

  // get members data
  getMembers(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'teamMembers/getFilteredTeamMembers',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.members = data?.value?.teamMemberDtos;
            this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.membersLoading = false;
        },
        error: (err: any) => {
          this.membersLoading = false;
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
  onFilterMembers(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('teamMembers/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.members = data?.value;
              this.totalItemsCount = data?.value?.length;
            }
            this.membersLoading = false;
          },
          error: (err: any) => {
            this.membersLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getMembers();
    }
  }

  //add a new
  submit() {
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('vehicles/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/inventory/vehicles']);
          }
        },
        error: (err: any) => {
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
            this.toastr.error(err?.error[0]?.message, 'Error');
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
  trackFun(index: number, item: any): number {
    return item.id;
  }
}
