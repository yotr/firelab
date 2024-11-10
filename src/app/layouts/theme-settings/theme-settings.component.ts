import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.css'],
})
export class ThemeSettingsComponent implements OnInit {
  //variables
  currentTheme: any;
  avilaThemes: any;
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  isThemeSettingActive: boolean = false;

  constructor(
    private themeService: ThemeService,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {
    //get avilabele themes from service
    this.avilaThemes = this.themeService.getAvilableThemes();
  }

  ngOnInit() {
    this.themeService
      .getCurrentTheme()
      .subscribe((theme) => (this.currentTheme = JSON.parse(theme)));
    this.getLanguages();
  }

  //set the theme
  setThemeSettings(key: string, value: any) {
    this.themeService.setTheme(key, value);
  }

  getLanguages() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
  }
  //handle translation (to send which language selcted) function
  switchLanguage(event: string): void {
    this.languageService.setLanguage(event);
    this.translateService.use(event);
  }
  //handle settings section display
  themeSettingDisplay() {
    this.isThemeSettingActive = !this.isThemeSettingActive;
  }
}
