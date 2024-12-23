import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
})
export class EditCustomerComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  selectUserType: string = 'normal';
  currentUser: any = null;
  sameAsCustomer: boolean = false;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  updateId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
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
        this.updateId = paramMap['get']('id');
      }
    });
    // Add form
    this.addForm = this.formBuilder.group(
      {
        // customer
        businessName: ['', [Validators.required]],
        contactName: [''],
        email: ['', [Validators.email]],
        cellPhone: [''],
        officePhone: [''],
        contactFaxNumber: [''],
        idAccount: [''],
        address1: [''],
        address2: [''],
        postalCode: [''],
        city: [''],
        // owner
        ownerBusinessName: ['', [Validators.required]],
        ownerContactName: [''],
        ownerEmail: ['', [Validators.email]],
        ownerCellPhone: [''],
        ownerOfficePhone: [''],
        ownerContactFaxNumber: [''],
        ownerId: [''],
        ownerAddress1: [''],
        ownerAddress2: [''],
        ownerPostalCode: [''],
        ownerCity: [''],
      }
      // { validators: passwordMatch }
    );
  }

  // convenience getter for easy access to form fields
  get formValues() {
    return this.addForm.controls;
  }

  ngAfterViewInit(): void {
    this.getCurrentData();
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
    let user = localStorage.getItem('firelab-loginData');
    // if exist
    if (user) {
      this.auth.currentUserSignal.set(JSON.parse(user));
      this.currentUser = JSON.parse(user)?.userData;
    } else {
    }
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('customers', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        this.addForm.patchValue({
          // customer
          businessName: data?.value?.businessName,
          contactName: data?.value?.contactName,
          email: data?.value?.email,
          cellPhone: data?.value?.cellPhone,
          officePhone: data?.value?.officePhone,
          contactFaxNumber: data?.value?.contactFaxNumber,
          idAccount: data?.value?.idAccount,
          address1: data?.value?.address1,
          address2: data?.value?.address2,
          postalCode: data?.value?.postalCode,
          city: data?.value?.city,
          // owner
          ownerBusinessName: data?.value?.ownerBusinessName,
          ownerContactName: data?.value?.ownerContactName,
          ownerEmail: data?.value?.ownerEmail,
          ownerCellPhone: data?.value?.ownerCellPhone,
          ownerOfficePhone: data?.value?.ownerOfficePhone,
          ownerContactFaxNumber: data?.value?.ownerContactFaxNumber,
          ownerId: data?.value?.ownerId,
          ownerAddress1: data?.value?.ownerAddress1,
          ownerAddress2: data?.value?.ownerAddress2,
          ownerPostalCode: data?.value?.ownerPostalCode,
          ownerCity: data?.value?.ownerCity,
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

  setOwnerData(event: any) {
    let checked = event.target.checked;
    this.sameAsCustomer = checked;
    if (checked) {
      this.addForm.patchValue({
        ownerBusinessName: this.addForm.get('businessName')?.value,
        ownerContactName: this.addForm.get('contactName')?.value,
        ownerEmail: this.addForm.get('email')?.value,
        ownerCellPhone: this.addForm.get('cellPhone')?.value,
        ownerOfficePhone: this.addForm.get('officePhone')?.value,
        ownerContactFaxNumber: this.addForm.get('contactFaxNumber')?.value,
        ownerAddress1: this.addForm.get('address1')?.value,
        ownerAddress2: this.addForm.get('address2')?.value,
        ownerPostalCode: this.addForm.get('postalCode')?.value,
        ownerCity: this.addForm.get('city')?.value,
      });
    } else {
      // this.addForm.patchValue({
      //   ownerBusinessName: '',
      //   ownerContactName: '',
      //   ownerEmail: '',
      //   ownerCellPhone: '',
      //   ownerOfficePhone: '',
      //   ownerContactFaxNumber: '',
      //   ownerAddress1: '',
      //   ownerAddress2: '',
      //   ownerPostalCode: '',
      //   ownerCity: '',
      // });
    }
  }
  fillOwnerData() {
    if (this.sameAsCustomer) {
      this.addForm.patchValue({
        ownerBusinessName: this.addForm.get('businessName')?.value,
        ownerContactName: this.addForm.get('contactName')?.value,
        ownerEmail: this.addForm.get('email')?.value,
        ownerCellPhone: this.addForm.get('cellPhone')?.value,
        ownerOfficePhone: this.addForm.get('officePhone')?.value,
        ownerContactFaxNumber: this.addForm.get('contactFaxNumber')?.value,
        ownerAddress1: this.addForm.get('address1')?.value,
        ownerAddress2: this.addForm.get('address2')?.value,
        ownerPostalCode: this.addForm.get('postalCode')?.value,
        ownerCity: this.addForm.get('city')?.value,
      });
    } else {
      // this.addForm.patchValue({
      //   ownerBusinessName: '',
      //   ownerContactName: '',
      //   ownerEmail: '',
      //   ownerCellPhone: '',
      //   ownerOfficePhone: '',
      //   ownerContactFaxNumber: '',
      //   ownerAddress1: '',
      //   ownerAddress2: '',
      //   ownerPostalCode: '',
      //   ownerCity: '',
      // });
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
      this.apiService?.update('customers', this.updateId, data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت تحديث البيانات بنجاح...');
            } else {
              this.toastr.success('data updated successfully...', 'Success');
            }
            this.router.navigate(['/modules/customers/allCustomers']);
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
}
