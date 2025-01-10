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
import { AuthService } from 'src/app/services/auth/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
declare const $: any;

@Component({
  selector: 'app-building-info',
  templateUrl: './building-info.component.html',
  styleUrls: ['./building-info.component.css'],
})
export class BuildingInfoComponent implements OnInit, AfterViewInit {
  @Input() isReportsActive: boolean = true;
  currentTheme: any;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  deleteId: any = null;
  editId: any = null;
  updatedData: any = null;
  data: any[] = [];
  loading: boolean = true;
  getDataError: boolean = false;
  totalItemsCount: number = 0;

  customerId: any = null;

  section: any = null;

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService,
    private auth: AuthService,
    private toastr: ToastrService,
    public apiService: ApiService
  ) {
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
  }

  ngAfterViewInit(): void {
    this.getData();
  }
  ngOnInit() {
    this.getTheme();
    this.getLanguage();
    this.getCurrentCustomerId();
  }
  // get theme from localStorage
  getTheme() {
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

  navigateTo(path: string, id?: any) {
    if (id) {
      this.router.navigate([path, id], {
        queryParams: { customerId: this.customerId },
      });
    } else {
      this.router.navigate([path], {
        queryParams: { customerId: this.customerId },
      });
    }
  }

  getData() {
    this.apiService
      ?.get(`customerBuildingInfo/customer/${this.customerId}`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          if (data?.isSuccess) {
            this.data = data?.value;
            this.getDataError = false;
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.data = [];
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
  deleteItem() {
    this.apiService.delete(`customerBuildingInfo`, this.deleteId).subscribe({
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
}
