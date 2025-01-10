import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit, AfterViewInit {
  @Input() isReportsActive: boolean = true;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  viewUrl: string = 'assets/logo.png';

  data: any[] = [];
  loading: boolean = true;
  getDataError: boolean = false;
  totalItemsCount: number = 0;
  dataKeys: any[] = [];

  customerId: any = null;
  section: any = null;

  deleteId: any;

  api: string = '';

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.translateService.use(this.currentLanguage);
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
      }
      if (paramMap['get']('section')) {
        this.section = paramMap['get']('section');
      }
    });
    this.api = environment.API;
  }
  ngAfterViewInit(): void {
    this.getData();
  }

  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    this.getCurrentCustomerId();
  }

  getTheme() {
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  getLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
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
      this.router.navigate([], {
        queryParams: { customerId: this.customerId },
      });
    } else {
      this.router.navigate(['/modules/customers/allCustomers']);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path], {
      queryParams: { customerId: this.customerId },
    });
  }

  onView(imageUrl: string) {
    this.viewUrl = imageUrl;
  }
  onUpdateImage(event: any, id: any) {
    let comment = event.target.value;
    if (comment.trim() != '') {
      let data = {
        comment: comment,
      };
      if (event?.keyCode === 13) {
        // api
        this.apiService.update('imageCustomerInfo', id, data).subscribe({
          next: (data) => {
            console.log(data);
            if (data?.isSuccess) {
              if (this.currentLanguage == 'ar') {
                this.toastr.success('تمت التعديل البيانات بنجاح...');
              } else {
                this.toastr.success('data updated successfully...', 'Success');
              }
            }
          },
          error: (err: any) => {
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
    } else {
      if (this.currentLanguage == 'ar') {
        this.toastr.warning('الرجاء إدخال الحقول المطلوبة');
      } else {
        this.toastr.warning('Please enter the required fields');
      }
    }
  }
  onDeleteFile() {
    this.apiService.delete('imageCustomerInfo', this.deleteId).subscribe({
      next: (data) => {
        if (data?.isSuccess) {
          this.data = this.data.filter(
            (item: any) => item?.id !== this.deleteId
          );
          if (this.currentLanguage == 'ar') {
            this.toastr.success('تم حذف العنصر بنجاح...');
          } else {
            this.toastr.success('item deleted successfully...');
          }
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
  //get data
  getData() {
    // api
    this.loading = true;
    this.apiService
      ?.get(`imageCustomerInfo/customer/${this.customerId}`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value;
            // this.totalItemsCount = data?.value?.totalCount;
            this.getDataError = false;
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.getDataError = true;
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
