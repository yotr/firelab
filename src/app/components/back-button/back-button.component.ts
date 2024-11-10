import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css'],
})
export class BackButtonComponent implements OnInit {
  currentTheme: any = null;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // get theme from localStorage
    this.themeService.getCurrentTheme().subscribe((theme) => {
      this.currentTheme = JSON.parse(theme);
    });
  }

  back() {
    window.history.back();
  }
}
