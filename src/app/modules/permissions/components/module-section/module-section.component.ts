import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-module-section',
  templateUrl: './module-section.component.html',
  styleUrls: ['./module-section.component.css'],
})
export class ModuleSectionComponent implements OnInit {
  @Input() isModuleOpened: boolean = false;
  @Input() module: any = {};
  currentLanguage: any = localStorage.getItem('lang');

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
  onPageCheckBox(status: boolean, code: any, pageIndex: number): void {
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
    }
  }

  removeSelectedPageActionInRow(readValue: boolean, pageId: any) {
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
    }
  }

  // markAllAsRead(currentValue: boolean, subId: any) {
  //   console.log(currentValue);
  //   if (currentValue) {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.read = true;
  //         });
  //       }
  //     });
  //   } else {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.read = false;
  //         });
  //       }
  //     });
  //   }
  // }
  // markAllAsEdit(currentValue: boolean, subId: any) {
  //   if (currentValue) {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.update = true;
  //         });
  //       }
  //     });
  //   } else {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.update = false;
  //         });
  //       }
  //     });
  //   }
  // }
  // markAllAsAdd(currentValue: boolean, subId: any) {
  //   if (currentValue) {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.add = true;
  //         });
  //       }
  //     });
  //   } else {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.add = false;
  //         });
  //       }
  //     });
  //   }
  // }
  // markAllAsDelete(currentValue: boolean, subId: any) {
  //   if (currentValue) {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.delete = true;
  //         });
  //       }
  //     });
  //   } else {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.delete = false;
  //         });
  //       }
  //     });
  //   }
  // }
  // markAllAsImport(currentValue: boolean, subId: any) {
  //   if (currentValue) {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.import = true;
  //         });
  //       }
  //     });
  //   } else {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.import = false;
  //         });
  //       }
  //     });
  //   }
  // }
  // markAllAsExport(currentValue: boolean, subId: any) {
  //   if (currentValue) {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.export = true;
  //         });
  //       }
  //     });
  //   } else {
  //     this.module.subModuleDto.forEach((sub: any) => {
  //       if (sub.id === subId) {
  //         sub.pageDto.forEach((page: any) => {
  //           page.export = false;
  //         });
  //       }
  //     });
  //   }
  // }
}
