import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-auto-email',
  templateUrl: './auto-email.component.html',
  styleUrls: ['./auto-email.component.css'],
})
export class AutoEmailComponent implements OnInit {
  addForm: FormGroup;
  currentTheme: any;
  deleteId: any = null;
  deleteIndex: any = null;
  editId: any = null;
  updatedData: any = null;
  currentLanguage: any = localStorage.getItem('lang');
  customerId: any = null;
  uploading: boolean = false;
  email: any = null;
  // emails
  autoEmails: any[] = [];
  autoEmailsLoading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private apiService: ApiService
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
      // emails
      emails: this.formBuilder.array([]),
    });
  }
  ngOnInit() {
    this.getTheme();
    this.getCurrentLanguage();
    this.getCurrentCustomerId();
    this.getEmails();
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

  get emails(): FormArray {
    return this.addForm.get('emails') as FormArray;
  }

  newItem(): FormGroup {
    return this.formBuilder.group({
      email: '',
      id: -1,
    });
  }

  addEmailItem() {
    if (this.autoEmails.length == this.emails.length) {
      this.emails.push(this.newItem());
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('لا يمكن إضافة سوى بريد إلكتروني واحد في كل مرة.');
      } else {
        this.toastr.warning('Only one email can be added at a time.');
      }
    }
  }
  //removing rows from table
  removeEmailItems(i: any, item: any) {
    this.deleteId = item?.id;
    this.deleteIndex = i;
    // this.emails.removeAt(i);
  }

  // get emails comeing from data
  addExistingEmailsItems(items: any[]): void {
    items?.map((item: any) => {
      // push item in items list data
      let value = this.formBuilder.group({
        email: item?.email,
        id: item?.id,
      });
      this.emails.push(value);
    });
  }

  getEmails() {
    this.autoEmails = [{ id: 1, email: 'email@example.com' }];
    this.addExistingEmailsItems(this.autoEmails);
    // this.apiService.get('customerPortals').subscribe({
    //   next: (data: any) => {
    //     console.log(data);
    //     if (data?.isSuccess) {
    //       this.autoEmails = data?.value;
    //       this.autoEmailsLoading = false;
    //     }
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     if (this.currentLanguage == 'ar') {
    //       this.toastr.error('هناك شيء خاطئ', 'خطأ');
    //     } else {
    //       this.toastr.error('There Is Somthing Wrong', 'Error');
    //     }
    //     this.autoEmailsLoading = false;
    //   },
    //   complete: () => {
    //     this.autoEmailsLoading = false;
    //   },
    // });
  }
  deleteItem() {
    console.log(this.deleteId);
    if (this.deleteId == -1) {
      this.emails.removeAt(this.deleteIndex);
    } else {
      console.log(this.autoEmails);
      console.log(this.emails.value);
      this.emails.removeAt(this.deleteIndex);
      this.autoEmails = this.autoEmails.filter(
        (item: any) => item?.id !== this.deleteId
      );

      this.apiService.delete('customers', this.deleteId).subscribe({
        next: (data) => {
          if (data?.isSuccess) {
            if (this.currentLanguage == 'ar') {
              this.toastr.success('تم حذف العنصر بنجاح...');
            } else {
              this.toastr.success('item deleted successfully...');
            }

            this.autoEmails = this.autoEmails.filter(
              (item: any) => item?.id !== this.deleteId
            );
            this.emails.removeAt(this.deleteIndex);
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
        complete: () => {},
      });
    }
  }
  //add a new
  submit() {
    if (this.emails.length != this.autoEmails.length) {
      let data = {
        customerId: this.customerId,
        email: this.emails?.value[this.emails.length - 1]?.email,
        id: this.uuidv4(),
      };

      if (this.autoEmails.length == this.emails?.length - 1) {
        this.autoEmails.push({ id: data?.id, email: data?.email });
        this.addForm.get('emails')?.setValue(this.autoEmails);
        // this.addExistingEmailsItems([{ email: data?.email }]);
        console.log(data);
        this.uploading = true;
        // api
        this.apiService?.add('customerPortals/add', data).subscribe({
          next: (data) => {
            console.log(data);
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت إضافة البيانات بنجاح...');
              } else {
                this.toastr.success('data added successfully...', 'Success');
              }
              this.router.navigate(['/modules/customers/importDevices'], {
                queryParams: { customerId: this.customerId },
              });
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
          this.toastr.warning(
            'لا يمكن إضافة سوى بريد إلكتروني واحد في كل مرة.'
          );
        } else {
          this.toastr.warning('Only one email can be added at a time.');
        }
      }
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }
  // getnerate random uuid
  uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}
