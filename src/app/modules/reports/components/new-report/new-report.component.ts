import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css'],
})
export class NewReportComponent implements OnInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  // types
  types: any[] = [];
  typesLoading: boolean = true;
  // reports
  reports: any[] = [];
  reportsLoading: boolean = true;

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    private sidebarService: SidebarService
  ) {
    this.types = ['Bell', 'Door Holder', 'Door Lock'];

    this.reports = ['Alarm', 'Fire Door'];
    // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
  }

  ngOnInit() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
  }
}
