import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService,
    // private signalingService: SignalingService,
    private router: Router
  ) {
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
