import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-assigned-job-view',
  templateUrl: './assigned-job-view.component.html',
  styleUrls: ['./assigned-job-view.component.css'],
})
export class AssignedJobViewComponent implements OnInit {
  addForm: FormGroup;
  loading: boolean = true;
  hours: any[] = [];
  minutes: any[] = [];
  durations: any[] = [];
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
  checkedMembers: any[] = [];
  servicesTotal: any = '00.00';
  partsTotal: any = '00.00';
  itemsTotal: any = '00.00';

  currentWarrantyContract: any = null;

  assignedDataId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
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
      external: ['false'],
      customerApproved: ['false'],
      inspectorNote: [['']],
      customerNote: [['']],
      deficiencyIds: this.formBuilder.array([]),
      services: this.formBuilder.array([]),
      parts: this.formBuilder.array([]),
      items: this.formBuilder.array([]),
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

  get services(): FormArray {
    return this.addForm.get('services') as FormArray;
  }
  get parts(): FormArray {
    return this.addForm.get('parts') as FormArray;
  }
  get items(): FormArray {
    return this.addForm.get('items') as FormArray;
  }

  // get Deficiencies coming from data
  addExistingDeficienciesItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.deficiency?.name,
      });
      this.deficiencyIds.push(value);
    });
  }

  // get Services coming from data
  addExistingServicesItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.services?.name,
        cost: item?.services?.cost,
      });
      this.services.push(value);
    });

    // get Services totall cost
    const totalCost = this.services.value?.reduce(
      (sum: any, item: any) => sum + item?.cost,
      0
    );
    this.servicesTotal = totalCost;
  }

  // get Parts coming from data
  addExistingPartsItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.part?.partName,
        qty: item?.qty,
        rate: item?.rate,
        quantity: item?.part?.quantity,
        partId: item?.part?.id,
      });
      this.parts.push(value);
    });

    // get parts totall cost
    const totalCost = this.parts.value?.reduce(
      (sum: any, item: any) => sum + item?.rate * item?.qty,
      0
    );

    this.partsTotal = totalCost;
  }
  // get items comeing from data
  addExistingItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        id: item?.id,
        name: item?.item?.name,
        cost: item?.item?.cost,
        quantity: item?.item?.quantity,
        qty: item?.quantity,
        itemId: item?.item?.id,
      });
      this.items.push(value);
    });
    // get parts totall cost
    const totalCost = this.items.value?.reduce(
      (sum: any, item: any) => sum + item?.cost * item?.qty,
      0
    );

    this.itemsTotal = totalCost;
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
    this.apiService
      .getById('assignedJobs/GetByJobId', this.assignedJobId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            let ids = data?.value?.teamIds?.map(
              (item: any) => item?.teamMemberId
            );
            //  set values
            this.assignedDataId = data?.value?.id;
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
            this.addExistingDeficienciesItems(
              data?.value?.job?.assignedDeficiencies
            );
            this.addExistingServicesItems(data?.value?.assignedServices);
            this.addExistingPartsItems(data?.value?.assignedJobsParts);
            this.members = this.getWithCheckedMembers(ids);
            this.checkedMembers = this.getCheckedMembers(ids);
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
        complete: () => {
          if (this.currentJob?.warrantyContractId != null) {
            this.getWarrantyContract(this.currentJob?.warrantyContractId);
          }
        },
      });
  }
  getWithCheckedMembers(teamIds: string[]): any[] {
    return this.members.map((m: any) => {
      if (teamIds.includes(m?.id)) {
        return { ...m, checked: true };
      }
      return m;
    });
  }
  getCheckedMembers(teamIds: string[]): any[] {
    let checkedData: any[] = [];
    this.members.map((m: any) => {
      if (teamIds.includes(m?.id)) {
        checkedData.push({ ...m, checked: true });
      }
    });
    return checkedData;
  }

  // get current data
  getWarrantyContract(id: any) {
    this.apiService.getById('warrantyContract', id).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.currentWarrantyContract = data?.value;
          this.addExistingItems(data?.value?.items);
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
  completeJob(): void {
    // update job to be completed
    this.apiService
      .statusChange(`jobs/complete/${this.assignedJobId}?complete=${true}`)
      .subscribe({
        next: (data) => {
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت المهمة بنجاح...');
            } else {
              this.toastr.success('Job Completed successfully...', 'Success');
            }
            this.currentJob.complete = true;
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
        complete: () => {
          // this.createInvoice();
        },
      });
  }
  uncompleteJob(): void {
    // update job to be uncomplete
    this.apiService
      .statusChange(`jobs/complete/${this.assignedJobId}?complete=${false}`)
      .subscribe({
        next: (data) => {
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('لم يتم إكمال المهمة بنجاح...');
            } else {
              this.toastr.success(
                'Job Not Completed successfully...',
                'Success'
              );
            }
            this.currentJob.complete = false;
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

  createInvoice() {
    let total = this.servicesTotal + this.partsTotal + this.itemsTotal;
    let data = {
      // BillingAddress:,
      invoiceDate: new Date(),
      status: 'unpaid',
      totalAmount: total,
      customerId: this.currentJob?.customer?.id,
      assignedJobId: this.assignedDataId,
    };
    // api
    this.apiService.add('invoices/add', data).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data added successfully...', 'Success');
          }
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
  }

  // deleteInvoice(deficiencyId: any, i: number): void {
  //   // api
  //   this.apiService
  //     .delete('jobs/assignedDeficiencies/delete', deficiencyId)
  //     .subscribe({
  //       next: (data) => {
  //         console.log(data);
  //         if (data?.isSuccess) {
  //           this.deficiencyIds.removeAt(i);
  //           if (this.currentLanguage == 'ar') {
  //             this.toastr.success('تمت حذف البيانات بنجاح...');
  //           } else {
  //             this.toastr.success('data deleted successfully...', 'Success');
  //           }
  //         }
  //       },
  //       error: (err: any) => {
  //         console.log('Error:', err);
  //         if (this.currentLanguage == 'ar') {
  //           this.toastr.error('هناك شيء خاطئ', 'خطأ');
  //         } else {
  //           this.toastr.error('There Is Somthing Wrong', 'Error');
  //         }
  //         this.uploading = false;
  //       },
  //       complete: () => {
  //         this.uploading = false;
  //       },
  //     });
  // }
}
