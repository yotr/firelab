import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-add-recurring-inspections',
  templateUrl: './add-recurring-inspections.component.html',
  styleUrls: ['./add-recurring-inspections.component.css'],
})
export class AddRecurringInspectionsComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  getDataError: boolean = false;
  // frequency
  frequencies: any[] = [];
  frequencyLoading: boolean = true;
  // defaultPermissions: Permission[];
  uploading: boolean = false;
  isPricesAdded: boolean = false;
  isTasksAdded: boolean = false;
  customerId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService
  ) {
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
      }
    });
    // Add form
    this.addForm = this.formBuilder.group({
      reportCategoryId: [null, [Validators.required]],
      frequency: ['', [Validators.required]],
      year: ['', [Validators.required]],
      firstPrice: [0],
      secondPrice: [0],
      thirdPrice: [0],
      forthPrice: [0],
      // tasks
      tasks: this.formBuilder.array([]),
    });
    this.frequencies = [
      {
        id: 0,
        name: 'Weekly',
      },
      {
        id: 1,
        name: 'Bi Weekly',
      },
      {
        id: 2,
        name: 'Monthly',
      },
      {
        id: 3,
        name: 'Bi Monthly',
      },
      {
        id: 4,
        name: 'Quarterly',
      },
      {
        id: 5,
        name: 'Semi Annual',
      },
      {
        id: 6,
        name: 'Annual',
      },
    ];
  }
  ngAfterViewInit(): void {
    this.getCategories();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
    this.getCurrentCustomerId();
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

  //handle display submenu from list menu array by know which item active
  setActiveMenu() {
    this.sidebarService.activateDropdown('1');
  }

  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    if (this.customerId != null) {
      this.setActiveMenu();
      // set querys to current page
      // this.router.navigate([], {
      //   queryParams: { customerId: this.customerId },
      // });
    } else {
      this.router.navigate(['/modules/customers/allCustomers']);
    }
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

  // get categories data
  getCategories() {
    this.apiService.get('reportCategories').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.categories = data?.value;
          this.getDataError = false;
        }
        this.categoriesLoading = false;
      },
      error: (err) => {
        this.categories = [];
        this.categoriesLoading = false;
        this.getDataError = true;
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

  togglePrices() {
    this.isPricesAdded = !this.isPricesAdded;
  }

  get tasks(): FormArray {
    return this.addForm.get('tasks') as FormArray;
  }

  newTaskItem(): FormGroup {
    return this.formBuilder.group({
      description: '',
      frequency: '',
      date: '',
    });
  }

  addTaskItem() {
    this.tasks.push(this.newTaskItem());
  }

  //removing rows from table
  removeTaskItems(i: any) {
    this.tasks.removeAt(i);
  }
  onCheck(event: any) {
    let value = event.target.checked;
    let tasks: any[] = this.tasks.value;
    if (value) {
      this.isTasksAdded = true;
      this.addTaskItem();
    } else {
      this.isTasksAdded = false;
      tasks.forEach((item, index) => {
        this.removeTaskItems(index);
      });
    }
  }

  //add a new
  submit() {
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
        customerId: this.customerId,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.add('recurringInspections/add', data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            this.router.navigate(['/modules/customers/recurringInspections'], {
              queryParams: { customerId: this.customerId },
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
  }
}
