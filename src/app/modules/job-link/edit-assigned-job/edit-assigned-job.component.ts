import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

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
  checkedMembers: any[] = [];
  servicesTotal: any = '00.00';
  partsTotal: any = '00.00';
  itemsTotal: any = '00.00';
  accepted: any = null;

  currentWarrantyContract: any = null;

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
      startTime: ['', [Validators.required]],
      // hours: ['', [Validators.required]],
      // minutes: ['', [Validators.required]],
      // meridiem: ['', [Validators.required]],
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

  // service
  newServiceItem(id: any, data: any): FormGroup {
    return this.formBuilder.group({
      id: id,
      name: data.name,
      cost: data.cost,
    });
  }
  addServiceItem(data: any) {
    $('#add_service_modal').modal('hide');
    if (data != null && data?.id && data?.name && data?.cost) {
      let isExistById = this.services.value?.find((d: any) => d.id == data?.id);
      let isExistByName = this.services.value?.find(
        (d: any) => d.name == data?.name
      );

      if (isExistByName != undefined) {
        if (this.currentLanguage == 'ar') {
          this.toastr.warning('هذا العنصر موجود بالفعل');
        } else {
          this.toastr.warning('this item already exist');
        }
      } else {
        this.addService(data?.id, data);
      }
    }
  }
  //removing rows from table
  removeServiceItem(i: any, id: any): void {
    this.deleteService(id, i);
  }
  addServiceRow() {
    $('#add_service_modal').modal('show');
  }
  // part
  newPartItem(id: any, data: any): FormGroup {
    return this.formBuilder.group({
      id: id,
      name: data.name,
      qty: data.qty,
      rate: data.rate,
      quantity: data.quantity,
      partId: data.partId,
    });
  }
  addPartItem(data: any) {
    console.log(data);
    $('#add_part_modal').modal('hide');
    if (data != null && data?.partId && data?.qty && data?.rate && data?.name) {
      let isExistById = this.parts.value?.find((d: any) => d.id == data?.id);
      let isExistByName = this.parts.value?.find(
        (d: any) => d.name == data?.name
      );

      if (isExistByName != undefined) {
        if (this.currentLanguage == 'ar') {
          this.toastr.warning('هذا العنصر موجود بالفعل');
        } else {
          this.toastr.warning('this item already exist');
        }
      } else {
        this.addPart(data);
      }
    }
  }
  //removing rows from table
  removeParItem(i: any, part: any): void {
    this.deletePart(part, i);
  }
  addPartRow() {
    $('#add_part_modal').modal('show');
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

    // get parts total cost
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
            startTime: this.formatDate(data?.value?.startTime),
            // hours: data?.value?.hours,
            // minutes: data?.value?.minutes,
            // meridiem: data?.value?.meridiem,
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

          this.accepted = data?.value?.accepted;
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
  submit() {
    const isFormChanged = this.addForm.dirty;

    if (isFormChanged) {
      if (this.addForm.valid) {
        let data = {
          ...this.addForm.value,
          startDate: new Date(
            this.addForm.get('startDate')?.value
          )?.toISOString(),
          endDate: this.isDurationByHours
            ? null
            : new Date(this.addForm.get('endDate')?.value)?.toISOString(),
          external:
            this.addForm.get('external')?.value == 'true' ? true : false,
          customerApproved:
            this.addForm.get('customerApproved')?.value == 'true'
              ? true
              : false,
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
    } else {
      history.back();
    }
  }
  acceptAssignedJob() {
    let value = true;
    this.apiService
      .update('assignedJobs/accept', this.assignedJobId, value)
      .subscribe({
        next: (data) => {
          if (data?.isSuccess) {
            this.accepted = true;
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تم تحديث الحالة بنجاح...');
            } else {
              this.toastr.success('Status updated successfully...');
            }
            // this.router.navigate(['/modules/jobLink'], {
            //   queryParams: { view: 'Week' },
            // });
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
          // if (assigned) {
          // // update job to be assigned
          // this.apiService
          //   .statusChange(
          //     `jobs/updateStatus/${
          //       this.addForm.get('jobId')?.value
          //     }?status=${true}`
          //   )
          //   .subscribe({
          //     next: (data) => {
          //       console.log(data);
          //       this.router.navigate(['/modules/jobLink'], {
          //         queryParams: { view: 'Week' },
          //       });
          //     },
          //     error: (err: any) => {
          //       console.log('Error:', err);
          //       if (this.currentLanguage == 'ar') {
          //         this.toastr.error('هناك شيء خاطئ', 'خطأ');
          //       } else {
          //         this.toastr.error('There Is Somthing Wrong', 'Error');
          //       }
          //     },
          //   });
          // }
        },
      });
  }
  rejectAssignedJob() {
    let value = false;
    this.apiService
      .update('assignedJobs/accept', this.assignedJobId, value)
      .subscribe({
        next: (data) => {
          if (data?.isSuccess) {
            this.accepted = false;
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تم تحديث الحالة بنجاح...');
            } else {
              this.toastr.success('Status updated successfully...');
            }
            // this.router.navigate(['/modules/jobLink'], {
            //   queryParams: { view: 'Week' },
            // });
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
          // if (assigned) {
          //   // update job to be assigned
          //   this.apiService
          //     .statusChange(
          //       `jobs/updateStatus/${
          //         this.addForm.get('jobId')?.value
          //       }?status=${true}`
          //     )
          //     .subscribe({
          //       next: (data) => {
          //         console.log(data);
          //         this.router.navigate(['/modules/jobLink'], {
          //           queryParams: { view: 'Week' },
          //         });
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
  //add Service
  addService(id: any, value: any): void {
    let newData = {
      servicesId: id,
      assignedJobId: this.assignedJobId,
    };
    // api
    this.apiService.add('assignedServices/add', newData).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.services.push(this.newServiceItem(data?.value?.id, value));
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
        // get Services totall cost
        const totalCost = this.services.value?.reduce(
          (sum: any, item: any) => sum + item?.cost,
          0
        );
        this.servicesTotal = totalCost;
      },
    });
  }

  //add Service
  deleteService(id: any, i: number) {
    // api
    this.apiService.delete('assignedServices', id).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.services.removeAt(i);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت حذف البيانات بنجاح...');
          } else {
            this.toastr.success('data deleted successfully...', 'Success');
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
        // get Services totall cost
        const totalCost = this.services.value?.reduce(
          (sum: any, item: any) => sum + item?.cost,
          0
        );
        this.servicesTotal = totalCost;
      },
    });
  }

  //add Part
  addPart(value: any): void {
    let newData = {
      partId: value.partId,
      assignedJobId: this.assignedJobId,
      qty: value.qty,
      rate: value.rate,
    };
    // api
    this.apiService.add('assignedJobsParts/add', newData).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.parts.push(this.newPartItem(data?.value?.id, value));
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت إضافة البيانات بنجاح...');
          } else {
            this.toastr.success('data added successfully...', 'Success');
          }

          let newQty = value?.quantity - newData?.qty;
          this.updatePartQuantity(newData?.partId, newQty);
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
        // get parts totall cost
        const totalCost = this.parts.value?.reduce(
          (sum: any, item: any) => sum + item?.rate * item?.qty,
          0
        );
        this.partsTotal = totalCost;
      },
    });
  }

  //add Part
  deletePart(part: any, i: number) {
    // api
    this.apiService.delete('assignedJobsParts', part?.id).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.isSuccess) {
          this.parts.removeAt(i);
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تمت حذف البيانات بنجاح...');
          } else {
            this.toastr.success('data deleted successfully...', 'Success');
          }
          let qty = part?.quantity + part?.qty;
          // console.log(qty);
          this.updatePartQuantity(part?.partId, qty);
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
        const totalCost = this.parts.value?.reduce(
          (sum: any, item: any) => sum + item?.rate * item?.qty,
          0
        );
        this.partsTotal = totalCost;
      },
    });
  }

  updatePartQuantity(id: any, qty: number) {
    let newQty = {
      qty: qty,
    };
    // update
    this.apiService.update(`parts/updateQty`, id, newQty).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم تحديث العنصر بنجاح...');
          } else {
            this.toastr.success('item updated successfully...');
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
      },
      complete: () => {},
    });
  }
}
