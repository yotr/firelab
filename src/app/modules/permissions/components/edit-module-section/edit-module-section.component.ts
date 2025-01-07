import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-edit-module-section',
  templateUrl: './edit-module-section.component.html',
  styleUrls: ['./edit-module-section.component.css'],
})
export class EditModuleSectionComponent implements OnInit {
  @Input() isModuleOpened: boolean = false;
  @Input() module: any = {};
  currentLanguage: any = localStorage.getItem('lang');
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.getCurrentLanguage();
  }

  getCurrentLanguage() {
    // get language from localStorage
    this.languageService.getCurrentLanguage().subscribe((language: any) => {
      this.currentLanguage = language;
      // turn on current language (trandlate)
      this.translateService.use(this.currentLanguage);
    });
  }

  toggleModule() {
    this.isModuleOpened = !this.isModuleOpened;
  }

  // check module CheckBox
  onObjectCheckBox(event?: any, obj?: any) {
    let value = event.target.checked;
    if (value) {
      for (const key in obj) {
        if (typeof obj[key] === 'boolean') {
          obj[key] = true;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.onObjectCheckBox(event, obj[key]);
        }
      }
    } else {
      for (const key in obj) {
        if (typeof obj[key] === 'boolean') {
          obj[key] = false;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.onObjectCheckBox(event, obj[key]);
        }
      }
    }
  }
  // check page CheckBox
  onPageCheckBox(
    status: boolean,
    code: any,
    permissionId: any,
    data: any
  ): void {
    if (status) {
      this.module.pages = this.module.pages.map((result: any) =>
        result?.code == code
          ? {
              ...result,
              read: true,
              update: true,
              create: true,
              delete: true,
            }
          : { ...result }
      );
      // update permission page
      this.onChange.emit({
        status,
        id: permissionId,
        action: 'all',
        data: data,
      });
    } else {
      this.module.pages = this.module.pages.map((result: any) =>
        result?.code == code
          ? {
              ...result,
              read: false,
              update: false,
              create: false,
              delete: false,
            }
          : { ...result }
      );
      // update permission page
      this.onChange.emit({
        status,
        id: permissionId,
        action: 'all',
        data: data,
      });
    }
  }

  removeSelectedPageActionInRow(readValue: boolean, pageId: any, data: any) {
    if (!readValue) {
      this.module.pages = this.module.pages.map((page: any) => {
        if (page.id === pageId) {
          return {
            ...page,
            update: false,
            create: false,
            delete: false,
            checked: false,
          };
        } else {
          return page;
        }
      });
      // update permission page
      this.onChange.emit({
        status: readValue,
        id: pageId,
        action: 'read',
        data,
      });
    } else {
      // update permission page
      this.onChange.emit({
        status: readValue,
        id: pageId,
        action: 'read',
        data,
      });
    }
  }

  onUpdate(status: boolean, id: any, action: string, data: any) {
    // update permission page
    this.onChange.emit({ status, id, action, data });
  }
}
