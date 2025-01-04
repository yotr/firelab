import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-assign-tools',
  templateUrl: './assign-tools.component.html',
  styleUrls: ['./assign-tools.component.css'],
})
export class AssignToolsComponent implements OnInit, AfterViewInit {
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
  // vehicles
  vehicles: any[] = [];
  vehiclesLoading: boolean = true;

  uploading: boolean = false;

  toolsKeys: any[] = [];

  tools: any[] = [];
  TeamMemberName: string = 'Select';

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    public translateService: TranslateService,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      vehicleId: [null, [Validators.required]],
    });

    this.toolsKeys = [
      {
        name: 'toolName',
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
  ngAfterViewInit(): void {
    this.getMembers();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentActiveUser();
    this.getVehicles();
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
    if (str?.length > length) {
      return str.slice(0, length - ending?.length) + ending;
    }
    return str;
  }

  onAddTool(event: any) {
    let tool = this.tools.find((item: any) => item?.id === event?.id);
    if (tool != undefined) {
      this.tools = this.tools.map((item: any) => {
        if (item?.id === tool?.id) {
          return { ...item, quantity: event?.quantity };
        } else {
          return item;
        }
      });
    } else {
      this.tools.push(event);
    }
  }
  onRemoveTool(id: any) {
    this.tools = this.tools.filter((tool) => tool.id !== id);
  }
  // on selecte teamMember
  onSelectVehicle(event: any) {
    console.log(event);
    this.TeamMemberName = event?.teamMember?.userName;
    this.addForm.patchValue({
      vehicleId: event?.id,
    });
  }
  // get Vehicles data
  getVehicles(page?: number, pageSize?: number) {
    // api
    this.apiService
      .filterData(
        'vehicles/getFilteredVehicles',
        page ? page : 1,
        pageSize ? pageSize : 10
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.vehicles = data?.value?.vehicleDtos;
            // this.totalItemsCount = data?.value?.totalCount;
            // this.getDataError = false;
          }
          this.vehiclesLoading = false;
        },
        error: (err: any) => {
          this.vehiclesLoading = false;
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
  onFilterVehicles(value: string) {
    if (value != null && value?.trim() != '') {
      this.apiService
        .globalSearch('vehicles/globalsearch', value, null)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            if (data?.isSuccess) {
              this.vehicles = data?.value;
              // this.totalItemsCount = data?.value?.length;
            }
            this.vehiclesLoading = false;
          },
          error: (err: any) => {
            this.vehiclesLoading = false;
            this.toastr.error('There Is Somthing Wrong', 'Error');
          },
        });
    } else {
      this.getVehicles();
    }
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
      let newTools = this.tools?.map((item: any) => {
        return { id: item.id, quantity: item?.quantity };
      });

      let data = {
        ...this.addForm.value,
        tools: newTools,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('assignedTools/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/inventory/tools']);
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
