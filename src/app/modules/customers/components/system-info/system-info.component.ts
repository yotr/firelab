import { AfterViewChecked, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.css'],
})
export class SystemInfoComponent implements OnInit, AfterViewChecked {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  data: any[] = [
    {
      id: 1,
      reportCategory: 'Alarm',
      system: 'Master Panel',
      type: 'Bell',
      quantity: '100',
    },
  ];
  loading: boolean = false;
  totalItemsCount: number = 0;
  dataKeys: any[] = [];

  customerId: any = null;

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarService: SidebarService
  ) {
    this.translateService.use(this.currentLanguage);
    //get id
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      if (paramMap['get']('customerId')) {
        this.customerId = paramMap['get']('customerId');
        // activate current customer id so we can get in other pages after refresh
        this.sidebarService.sendCurrentCustomer(paramMap['get']('customerId'));
      }
    });

    this.dataKeys = [
      {
        name: 'reporttype',
        display: 'Report type',
        type: 'string',
        active: true,
      },
      {
        name: 'system',
        display: 'System/Device',
        type: 'string',
        active: true,
      },
      {
        name: 'type',
        display: 'Type',
        type: 'string',
        active: true,
      },
      {
        name: 'quantity',
        display: 'Quantity',
        type: 'string',
        active: true,
      },
    ];
  }
  ngAfterViewChecked(): void {
    this.getData();
  }
  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    this.getCurrentCustomerId();
    this.navigationHandler();
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
    this.sidebarService.activateDropdown('Customers');
  }
  getCurrentCustomerId() {
    this.sidebarService.getCurrentCustomerValue().subscribe((value: any) => {
      if (value) {
        this.customerId = value;
      }
    });
    this.setActiveMenu();
    // set querys to current page
    this.router.navigate([], {
      queryParams: { customerId: this.customerId },
    });
  }
  navigationHandler() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url.includes('/customers/home') ||
          event.url.includes('/customers/owner') ||
          event.url.includes('/customers/customerInfo') ||
          event.url.includes('/customers/buildingInfo') ||
          event.url.includes('/customers/systemInfo')
        ) {
          this.getCurrentCustomerId();
        }
      }
    });
  }
  navigateToAddPage() {
    this.router.navigate(['/modules/customers/systemInfo/add'], {
      queryParams: { customerId: this.customerId },
    });
  }
  //get data
  getData(
    page?: number,
    pageSize?: number,
    column?: any,
    operator1?: any,
    operator2?: any,
    value1?: any,
    value2?: any
  ) {
    this.loading = false;
    this.totalItemsCount = this.data.length;
    // this.apiService
    //   .filterData(
    //     `clients/getFilteredClients`,
    //     page ? page : 1,
    //     pageSize ? pageSize : 10
    //   )
    //   .subscribe((data) => {
    //     this.clients = data?.clientDto;
    //     this.totalItemsCount = data?.totalCount;
    //     this.loading = false;
    //     // get dynamic columns keys
    //     // this.getTableTabKeys(data);
    //   });
  }
}
