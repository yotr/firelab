import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-customer-home-table',
  templateUrl: './customer-home-table.component.html',
  styleUrls: ['./customer-home-table.component.css'],
})
export class CustomerHomeTableComponent implements OnInit {
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

  constructor(
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {}

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
}
