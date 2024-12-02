import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
  @Input() isReportsActive: boolean = true;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  viewUrl: string = 'assets/logo.png';

  data: any[] = [
    {
      id: 1,
      image: 'assets/logo.png',
      comment: '',
    },
    {
      id: 2,
      image: 'assets/logo.png',
      comment: '',
    },
  ];
  loading: boolean = false;
  totalItemsCount: number = 0;
  dataKeys: any[] = [];

  customerId: any = null;
  section: any = null;

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
      if (paramMap['get']('section')) {
        this.section = paramMap['get']('section');
      }
    });
  }
  ngAfterViewChecked(): void {}
  ngOnInit() {
    this.getLanguage();
    this.getTheme();
    this.getCurrentCustomerId();
    // this.navigationHandler();
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

  onView(imageUrl: string) {
    this.viewUrl = imageUrl;
  }
  onUploadFile(file: any) {
    let newFile = {
      id: 3,
      image: file,
      comment: '',
    };
    this.data.push(newFile);
  }
}
