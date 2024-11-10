import { Component, OnInit } from '@angular/core';
//translation service
import { TranslateService } from '@ngx-translate/core';
//services
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  //variables
  isSidebarClosed: boolean = false;
  //current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;

  constructor(
    private sidebarStatusService: SidebarService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    // get sidebar status
    this.sidebarStatusService.getSidebarStatus().subscribe((sidebarStatus) => {
      this.isSidebarClosed = sidebarStatus;
    });
    // turn on current language (trandlate)
    this.translateService.use(this.currentLanguage);
  }

  ngOnInit(): void {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language) => {
      this.currentLanguage = language;
    });
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  //handle sidebar toogle function
  sidebarToggle() {
    this.isSidebarClosed
      ? this.sidebarStatusService.open()
      : this.sidebarStatusService.close();
  }

  //handle translation (to send which language selcted) function
  switchLanguage(event: string): void {
    this.languageService.setLanguage(event);
    this.translateService.use(event);
  }
}
