import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
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
  uploading: boolean = false;

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
  ngAfterViewInit(): void {}

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
      this.addForm.patchValue({
        ownerBusinessName: '',
        ownerContactName: '',
        ownerEmail: '',
        ownerCellPhone: '',
        ownerOfficePhone: '',
        ownerContactFaxNumber: '',
        ownerAddress1: '',
        ownerAddress2: '',
        ownerPostalCode: '',
        ownerCity: '',
      });
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
      this.addForm.patchValue({
        ownerBusinessName: '',
        ownerContactName: '',
        ownerEmail: '',
        ownerCellPhone: '',
        ownerOfficePhone: '',
        ownerContactFaxNumber: '',
        ownerAddress1: '',
        ownerAddress2: '',
        ownerPostalCode: '',
        ownerCity: '',
      });
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
      this.apiService.add('customers/add', data).subscribe({
        next: (data) => {
          console.log(data);
          // errors;
          if (data?.result?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/customers/allCustomers']);
          }
        },
        error: (err: any) => {
          console.log('Error:', err);
          if (this.currentLanguage == 'ar') {
            this.toastr.error('هناك شيء خاطئ', 'خطأ');
          } else {
            this.toastr.error('There Is Somthing Wrong', 'Error');
            // this.toastr.error(err?.error?.title, 'Error');
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
