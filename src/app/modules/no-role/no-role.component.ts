import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';
import { SidebarService } from 'src/app/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-no-role',
  templateUrl: './no-role.component.html',
  styleUrls: ['./no-role.component.css'],
})
export class NoRoleComponent implements OnInit, AfterViewInit {
  currentTheme: any;
  role = null;
  // current language
  currentLanguage: any = localStorage.getItem('lang');

  constructor(
    private themeService: ThemeService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private sidebarService: SidebarService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    this.getRoles();
  }

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

  getRoles() {
    // check if user is logged in
    this.sidebarService.getRoles().subscribe((role) => {
      role = role;
      if (role != null) {
        this.router.navigate(['/modules/profile']);
      }
    });
  }
}
