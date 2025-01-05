import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-assigned-parts-table',
  templateUrl: './assigned-parts-table.component.html',
  styleUrls: ['./assigned-parts-table.component.css']
})
export class AssignedPartsTableComponent implements OnInit {

 //current language
  currentLanguage: any = localStorage.getItem('lang');
  currentTheme: any;
  @Input() data: any[] = [];
  @Input() dataKeys: any[] = [];
  @Input() deleteModalTitle: string = '';
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  constructor(
    private languageService: LanguageService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    public apiService: ApiService
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

  onRemovePart(id: any) {
    this.onRemove.emit(id);
  }
}
