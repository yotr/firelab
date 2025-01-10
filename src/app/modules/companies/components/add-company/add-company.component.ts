import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { passwordMatch } from 'src/app/validation/passwordMatch.validation';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
})
export class AddCompanyComponent implements OnInit {
  addForm: FormGroup;
  companies: any[] = [];
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  isCompanySectionActive: boolean = true;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  // roles
  roles: any[] = [];
  rolesLoading: boolean = true;

  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    private auth: AuthService
  ) {
    // Add form
    this.addForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      address: [''],
      phone: [''],
      website: [''],
      fax: [''],
      country: [''],
      city: [''],
      state: [''],
      postal: [''],
      contact: [''],
      companyEmail: [''],
      // manager
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      billableHourlyRate: ['', [Validators.required]],
      position: [''],
      division: [''],
      status: ['clocked'],
      roleId: [null],
    });
  }

  get formValues() {
    return this.addForm.controls;
  }

  ngOnInit() {
    this.getRoles();
    this.getTheme();
  }

  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  activeCompanySection() {
    this.isCompanySectionActive = true;
  }
  activeManagerSection() {
    let companyName = this.addForm?.get('companyName')?.value?.trim();
    if (companyName === '') {
      this.toastr.warning('', 'Please enter mandatory field First!');
    } else {
      this.isCompanySectionActive = false;
    }
  }

  onSelectRoles(event: any) {
    console.log(event);
    this.addForm.patchValue({
      roleId: event?.id,
    });
  }

  // get Roles data
  getRoles(page?: number, pageSize?: number) {
    // api
    this.apiService.get('roles').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.roles = data?.value;
          // this.totalItemsCount = data?.value?.totalCount;
          // this.getDataError = false;
        }
        this.rolesLoading = false;
      },
      error: (err: any) => {
        this.rolesLoading = false;
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
  // get categories data
  getCategories() {
    this.apiService.get('reportCategories').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.categories = data?.value;
          this.categoriesLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
        this.categoriesLoading = false;
      },
      complete: () => {
        this.categoriesLoading = false;
      },
    });
  }
  //add a new
  submit() {
    // add to server
    if (this.addForm.valid) {
      let newData = {
        company: {
          companyName: this.addForm.get('companyName')?.value,
          address: this.addForm.get('address')?.value,
          phone: this.addForm.get('phone')?.value,
          website: this.addForm.get('website')?.value,
          fax: this.addForm.get('fax')?.value,
          country: this.addForm.get('country')?.value,
          city: this.addForm.get('city')?.value,
          state: this.addForm.get('state')?.value,
          postal: this.addForm.get('postal')?.value,
          contact: this.addForm.get('contact')?.value,
          email: this.addForm.get('companyEmail')?.value,
        },
        manager: {
          firstName: this.addForm.get('firstName')?.value,
          lastName: this.addForm.get('lastName')?.value,
          userName: this.addForm.get('userName')?.value,
          email: this.addForm.get('managerEmail')?.value,
          password: this.addForm.get('password')?.value,
        },
      };

      console.log(newData);

      let added = false;
      // send the data to server
      this.apiService.add('companies/create', newData).subscribe({
        next: (data) => {
          added = true;
        },
        error: (error) => {
          this.toastr.error('there is something wrong', 'Error');
        },
        complete: () => {
          if (added) {
            this.toastr.success('Company added', 'Success');
            this.addForm.reset();
            this.router.navigate(['/modules/companies/all-companies']);
          }
        },
      });
    } else {
      this.toastr.error('', 'Please enter mandatory field!');
    }
  }

  trackFun(index: number, item: any): number {
    return item.id;
  }
}
