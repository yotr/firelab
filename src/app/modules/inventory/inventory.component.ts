import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, AfterViewInit {
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
  ngAfterViewInit(): void {}
}
