import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css'],
})
export class EditJobComponent implements OnInit, AfterViewInit {
  addForm: FormGroup;
  currentTheme: any;
  currentLanguage: any = localStorage.getItem('lang');
  // types
  types: any[] = [];
  typesLoading: boolean = true;
  // categories
  categories: any[] = [];
  categoriesLoading: boolean = true;
  getDataError: boolean = false;

  updateId: any = null;
  uploading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    //get id
    this.activatedRoute.paramMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('id')) {
        this.updateId = paramMap['get']('id');
      }
    });

    // Add form
    this.addForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      reportCategoryId: [null, [Validators.required]],
      type: ['', [Validators.required]],
      dateTime: ['', [Validators.required]],
      jobId: [''],
      action: ['notAssigned'],
      name: [''],
      customerId: [null],
      status: [false],
    });

    this.types = [
      {
        id: 0,
        name: 'Bell',
      },
      {
        id: 1,
        name: 'Door Holder',
      },
      {
        id: 2,
        name: 'Door Lock',
      },
    ];
  }

  ngAfterViewInit(): void {
    this.getCategories();
  }

  ngOnInit() {
    this.getTheme();
    this.getCurrentData();
    // this.getCurrentCustomerId();
  }
  // get theme from localStorage
  getTheme() {
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  //handle display submenu from list menu array by know which item active
  // setActiveMenu() {
  //   this.sidebarService.activateDropdown('1');
  // }
  // getCurrentCustomerId() {
  //   this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
  //     if (value) {
  //       this.customerId = value;
  //     }
  //   });
  //   this.setActiveMenu();
  //   // set querys to current page
  //   // this.router.navigate([], {
  //   //   queryParams: { customerId: this.customerId },
  //   // });
  // }

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

  formatDate(date: string): any {
    var newDate: Date = new Date(date); // Parse the input date string

    const year = newDate.getFullYear(); // Get the year
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (1-based) and ensure 2 digits
    const day = newDate.getDate().toString().padStart(2, '0'); // Get the day and ensure 2 digits
    return `${year}-${month}-${day}`; // Return formatted date string
  }

  // get current data
  getCurrentData() {
    this.apiService.getById('jobs', this.updateId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          //  set values
          this.addForm.patchValue({
            description: data?.value?.description,
            reportCategoryId: data?.value?.reportCategoryId,
            type: data?.value?.type,
            dateTime: this.formatDate(data?.value?.dateTime),
            jobId: data?.value?.jobId,
            action: data?.value?.action,
            name: data?.value?.name,
            customerId: data?.value?.customerId,
            status: data?.value?.status,
          });
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
    if (this.addForm.valid) {
      let data = {
        ...this.addForm.value,
        name: this.addForm.get('description')?.value,
      };
      console.log(data);
      this.uploading = true;
      // api
      this.apiService.update('jobs', this.updateId, data).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تمت إضافة البيانات بنجاح...');
            } else {
              this.toastr.success('data added successfully...', 'Success');
            }
            window.history.back();
            // this.router.navigate(['/modules/customers/addJob'], {
            //   queryParams: { customerId: this.customerId },
            // });
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
