import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
// import xlsx package to export function
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css'],
})
export class EditDeviceComponent implements OnInit {
  addForm: FormGroup;
  loading: boolean = true;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  currentUser: any = null;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  file: any = null;
  fileURL: any = null;
  excelData: any[] = [];

  // defaultPermissions: Permission[];
  uploading: boolean = false;
  customerId: any = null;
  updateId: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private apiService: ApiService,
    // private permissionsService: PermissionsService,
    private auth: AuthService
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
      reportCategory: ['', [Validators.required]],
      listName: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentActiveUser();
    // this.getCategories();
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
    this.sidebarService.activateDropdown('customers');
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
      this.router.navigate([], {
        queryParams: { customerId: this.customerId },
      });
    } else {
      this.router.navigate(['/modules/customers/allCustomers']);
    }
  }

  truncateString(str: any, length: any, ending = '...') {
    if (str.length > length) {
      return str.slice(0, length - ending.length) + ending;
    }
    return str;
  }
  importExcel(file: any) {
    //get file path
    let path = file.target.files[0];
    //file reader
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(path);
    // when file load
    fileReader.onload = (e) => {
      this.loading = false;
      //read sheet file from excel
      let workbook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workbook.SheetNames;
      //conver to json
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.excelData);
      // this.getTableTabKeys(this.excelData);
    };
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

  // get current data
  getCurrentData() {
    this.apiService.getById('devices', this.updateId).subscribe({
      next: (data: any) => {
        //  set values
        console.log(data);
        this.addForm.patchValue({
          reportCategory: data?.reportCategory,
          listName: data?.listName,
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

  //add a new
  submit() {
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
        devices: this.excelData,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService?.update('devices', this.updateId, data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
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
