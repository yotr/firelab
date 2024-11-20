import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-system-info-table',
  templateUrl: './system-info-table.component.html',
  styleUrls: ['./system-info-table.component.css'],
})
export class SystemInfoTableComponent implements OnInit {
  //current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  @Input() data: any[] = [];
  @Input() dataKeys: any[] = [];
  @Input() loading: boolean = true;
  // pagination
  @Input() totalItems: number = 0;
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  //pagination variables
  currentPage: number = 1;
  // count: number = 0;
  itemsPerPage: number = 10;
  deleteId: any = null;
  customerId: any = null;

  constructor(
    private languageService: LanguageService,
    private themeService: ThemeService,
    private router: Router,
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
  }

  ngOnInit() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
    });
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }
  navigateToEdit(id: any) {
    console.log(id);
    this.router.navigate(['/modules/customers/systemInfo/edit', id], {
      queryParams: { customerId: this.customerId },
    });
  }
  deleteItem() {}
}
