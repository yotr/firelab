import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-assign-parts',
  templateUrl: './assign-parts.component.html',
  styleUrls: ['./assign-parts.component.css'],
})
export class AssignPartsComponent implements OnInit, AfterViewInit {
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

  partsKeys: any[] = [];

  parts: any[] = [];
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
    this.partsKeys = [
      {
        name: 'parts',
        display: this.translateService.instant(
          'inventory.parts.assign.table.parts'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'sku',
        display: this.translateService.instant(
          'inventory.parts.assign.table.sku'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'quantity',
        display: this.translateService.instant(
          'inventory.parts.assign.table.quantity'
        ),
        type: 'string',
        active: true,
      },
      {
        name: 'price',
        display: this.translateService.instant(
          'inventory.parts.assign.table.price'
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

  onAddPart(event: any) {
    let part = this.parts.find((item: any) => item?.id === event?.id);
    if (part != undefined) {
      this.parts = this.parts.map((item: any) => {
        if (item?.id === part?.id) {
          return { ...item, quantity: event?.quantity };
        } else {
          return item;
        }
      });
    } else {
      this.parts.push(event);
    }
  }
  onRemovePart(id: any) {
    this.parts = this.parts.filter((part) => part.id !== id);
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
      let newParts = this.parts?.map((item: any) => {
        return {
          id: item.id,
          quantity: item?.quantity,
          supplierId: item?.supplierId,
          reportCategoryId: item?.reportCategoryId,
        };
      });

      let data = {
        ...this.addForm.value,
        parts: newParts,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('assignedParts/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/inventory/parts']);
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
