import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.css'],
})
export class AddContractComponent implements OnInit, AfterViewInit {
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
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  currentTeamMember: any = null;
  currentPage: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group(
      {
        contractReference: ['', [Validators.required]],
        teamMemberId: [null, [Validators.required]],
        salaryStructureType: [''],
        contractStartDate: [''],
        contractEndDate: [''],
        jobPosition: [''],
        contractSchedule: [''],
        contractType: [''],
        wage: [''],
        notes: [''],
        status: [false],
      }
      // { validators: passwordMatch }
    );
  }
  ngAfterViewInit(): void {
    this.getMembers();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language: any) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
  }

  // get current user
  getCurrentActiveUser() {
    // check local storage
    let user = localStorage.getItem('mms-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }
  // on selecte teamMember
  onSelectTeamMember(teamMember: any) {
    this.currentTeamMember = teamMember?.userName;
    this.addForm.patchValue({
      teamMemberId: teamMember?.id,
    });
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
  // get data
  getMembersEnd(page?: number, pageSize?: number) {
    this.membersLoading = true;
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
            this.members = [...this.members, ...data?.value?.teamMemberDtos];
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
        complete: () => {
          this.membersLoading = false;
        },
      });
  }
  loadMore() {
    this.currentPage++;
    this.getMembersEnd(this.currentPage);
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
        status: this.addForm.get('status')?.value == 'true' ? true : false,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('contracts/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/contract']);
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
}
