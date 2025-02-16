import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css'],
})
export class EditVehicleComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  deleteModalTitle: string = '';
  // members
  members: any[] = [];
  membersLoading: boolean = true;
  totalItemsCount: number = 0;
  getDataError: boolean = false;
  uploading: boolean = false;

  parts: any[] = [];
  tools: any[] = [];
  partsKeys: any[] = [];
  toolsKeys: any[] = [];
  partsLoading: boolean = false;
  toolsLoading: boolean = false;

  currentTeamMember: any = null;

  updateId: any = null;

  unassignId: any = null;
  unassignTable: string = '';
  currentPage: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    public translateService: TranslateService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.updateId = paramMap['get']('id');
      }
    });
    // Add form
    this.addForm = this.formBuilder.group({
      vehicleNumber: ['', [Validators.required]],
      teamMemberId: [null, [Validators.required]],
    });

    this.partsKeys = [
      {
        name: 'parts',
        display: this.translateService.instant(
          'inventory.vehicles.edit_tables.parts.parts'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'sku',
        display: this.translateService.instant(
          'inventory.vehicles.edit_tables.parts.sku'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'quantity',
        display: this.translateService.instant(
          'inventory.vehicles.edit_tables.parts.quantity'
        ),
        type: 'string',
        active: true,
      },
    ];
    this.toolsKeys = [
      {
        name: 'tools',
        display: this.translateService.instant(
          'inventory.vehicles.edit_tables.tools.tools'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'id',
        display: this.translateService.instant(
          'inventory.vehicles.edit_tables.tools.id'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'quantity',
        display: this.translateService.instant(
          'inventory.vehicles.edit_tables.tools.quantity'
        ),
        type: 'string',
        active: true,
      },
    ];
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

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('vehicles', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        this.currentTeamMember = data?.value?.teamMember?.userName;
        this.parts = data?.value?.parts;
        this.tools = data?.value?.tools;
        this.addForm.patchValue({
          vehicleNumber: data?.value?.vehicleNumber,
          teamMemberId: data?.value?.teamMemberId,
        });
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
      ?.filterData(
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
  getDataEnd(page?: number, pageSize?: number) {
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
            //  this.totalItemsCount = data?.value?.totalCount;
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
    this.getDataEnd(this.currentPage);
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
      this.apiService.update('vehicles', this.updateId, data).subscribe({
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

  onDeletePartsOrTools(event: any) {
    this.unassignId = event?.id;
    this.unassignTable = event?.table;
  }

  unAssign() {
    if (this.unassignTable == 'parts') {
      this.unAssignParts(this.unassignId);
    } else {
      this.unAssignTools(this.unassignId);
    }
  }

  unAssignParts(id: any) {
    this.apiService.delete('assignedParts', id).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          this.parts = this.parts.filter((item: any) => item?.id !== id);
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
        this.unassignId = null;
        this.unassignTable = '';
      },
    });
  }
  unAssignTools(id: any) {
    this.apiService.delete('assignedTools', id).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          this.tools = this.tools.filter((item: any) => item?.id !== id);
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
        this.unassignId = null;
        this.unassignTable = '';
      },
    });
  }
}
