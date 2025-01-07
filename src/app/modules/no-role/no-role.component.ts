import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-no-role',
  templateUrl: './no-role.component.html',
  styleUrls: ['./no-role.component.css'],
})
export class NoRoleComponent implements OnInit {
  currentTheme: any;
  // current language
  currentLanguage: any = localStorage.getItem('lang');

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.getLanguage();
    this.getTheme();
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

  refresh() {
    location.reload();
  }
}
