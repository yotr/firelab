import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.css'],
})
export class LanguageDropdownComponent implements OnInit {
  currentLanguage: any = localStorage.getItem('lang');
  selectedLanguage: any;
  avilableLanguages = [
    {
      id: 0,
      language: this.translateService.instant('header.languages.english'),
      value: 'en',
      flag: 'assets/img/flags/us.png',
    },
    {
      id: 1,
      language: this.translateService.instant('header.languages.arabic'),
      value: 'ar',
      flag: 'assets/img/flags/eg.png',
    },
  ];
  @Output() sendSelectedLanguage: EventEmitter<any> = new EventEmitter();

  constructor(private translateService: TranslateService) {
    //set default language
    this.translateService.setDefaultLang('en');
    //select language initilization
    this.selectedLanguage = {
      language: this.translateService.instant('header.languages.english'),
      value: 'en',
      flag: 'assets/img/flags/us.png',
    };

    // this.translateService.get('header.languages').subscribe((data) => {
    //   // this.avilableLanguages[0].language = data?.english;
    //   // this.avilableLanguages[1].language = data?.arabic;
    // });
  }

  ngOnInit() {
    this.getCurrentSelectedLanguage();
  }

  //get current selected language (showen language)
  getCurrentSelectedLanguage() {
    if (this.currentLanguage == 'en') {
      this.getSelectedLanguage(this.avilableLanguages[0]);
    } else if (this.currentLanguage == 'ar') {
      this.getSelectedLanguage(this.avilableLanguages[1]);
    }
  }
  // handle selected language
  getSelectedLanguage(language: any) {
    this.selectedLanguage = language;
    this.sendSelectedLanguage.emit(language?.value);
  }
}
