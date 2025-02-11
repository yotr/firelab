import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.css'],
})
export class EditInvoiceComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  servicesTotal: any = '00.00';
  partsTotal: any = '00.00';
  itemsTotal: any = '00.00';
  currentJob: any = null;
  currentWarrantyContract: any = null;
  grandTotal: number = 0.0;
  uploading: boolean = false;

  updateId: any = null;

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
        this.updateId = paramMap['get']('id');
      }
    });
    // Add form
    this.addForm = this.formBuilder.group({
      billingAddress: ['', [Validators.required]],
      invoiceNumber: ['', [Validators.required]],
      invoiceDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
      tax: [0],
      totalAmount: [0, [Validators.required]],
      customerId: [null, [Validators.required]],
      assignedJobId: [null, [Validators.required]],
      services: this.formBuilder.array([]),
      parts: this.formBuilder.array([]),
      items: this.formBuilder.array([]),
    });
  }
  get formValues() {
    return this.addForm.controls;
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

  formatDate(date: string): any {
    var newDate: Date = new Date(date); // Parse the input date string

    const year = newDate.getFullYear(); // Get the year
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (1-based) and ensure 2 digits
    const day = newDate.getDate().toString().padStart(2, '0'); // Get the day and ensure 2 digits
    return `${year}-${month}-${day}`; // Return formatted date string
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('invoices', this.updateId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          //  set values
          this.addForm.patchValue({
            billingAddress: data?.value?.billingAddress,
            invoiceNumber: data?.value?.invoiceNumber,
            invoiceDate: this.formatDate(data?.value?.invoiceDate),
            dueDate: this.formatDate(data?.value?.dueDate),
            status: data?.value?.status,
            tax: data?.value?.tax,
            totalAmount: data?.value?.totalAmount,
            customerId: data?.value?.customerId,
            assignedJobId: data?.value?.assignedJobId,
          });
          this.currentJob = data?.value?.assignedJob?.job;
          this.addExistingServicesItems(
            data?.value?.assignedJob?.assignedServices
          );
          this.addExistingPartsItems(
            data?.value?.assignedJob?.assignedJobsParts
          );
          // calc grandTotal
          if (data?.value?.tax == null) {
            this.getGrantTotal(data?.value?.totalAmount, 0);
          } else {
            this.getGrantTotal(data?.value?.totalAmount, data?.value?.tax);
          }
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
  onTaxChange(event: any) {
    let value = event.target.value;
    let tax = value / 100;
    let rate = tax * this.formValues['totalAmount'].value;
    this.grandTotal = rate + this.formValues['totalAmount'].value;
  }
  getGrantTotal(value: number, tax: number) {
    let taxP = tax / 100;
    let rate = taxP * value;
    this.grandTotal = rate + value;
  }
  submit() {
    const isFormChanged = this.addForm.dirty;
    if (isFormChanged) {
      if (this.addForm.valid) {
        let data = {
          billingAddress: this.addForm.get('billingAddress')?.value,
          invoiceNumber: this.addForm.get('invoiceNumber')?.value,
          invoiceDate: this.addForm.get('invoiceDate')?.value,
          dueDate: this.addForm.get('dueDate')?.value,
          status: this.addForm.get('status')?.value,
          tax: this.addForm.get('tax')?.value,
          totalAmount: this.addForm.get('totalAmount')?.value,
          customerId: this.addForm.get('customerId')?.value,
          assignedJobId: this.addForm.get('assignedJobId')?.value,
        };
        console.log(data);
        this.uploading = true;
        // api
        this.apiService.update('invoices', this.updateId, data).subscribe({
          next: (data) => {
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }
              this.router.navigate(['/modules/invoices']);
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
}
