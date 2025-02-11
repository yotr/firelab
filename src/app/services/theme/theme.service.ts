import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnInit {
  // array of theme
  themeSettings: any = {};
  private themeData: BehaviorSubject<string>;
  storedThemes: any = localStorage.getItem('mms-theme-settings');
  // default theme settings and binded to input values
  defaultSettings: any = {
    // layout: {
    //   title: 'Vertical',
    //   name: 'vertical',
    // },
    colorSchema: {
      title: 'Red',
      background: 'red-theme',
      color: 'red-theme-color',
    },
    sidebarColor: {
      title: 'Dark',
      background: 'sidebar-dark-theme',
      color: 'sidebar-dark-theme-color',
    },
    sidebarPosition: 'fixed',
  };
  constructor() {
    this.themeData = new BehaviorSubject<any>(this.storedThemes);
    this.themeData.next(this.storedThemes);

    this.themeSettings = {
      // layout: [
      //   {
      //     title: 'Vertical',
      //     name: 'vertical',
      //   },
      //   {
      //     title: 'Horizontal',
      //     name: 'horizontal',
      //   },
      //   {
      //     title: 'Two Column',
      //     name: 'tow-column',
      //   },
      // ],
      colorSchema: [
        {
          title: 'Orange',
          title_ar: 'برتقالي',
          background: 'orange-theme',
          color: 'orange-theme-color',
        },
        {
          title: 'Light',
          title_ar: 'أبيض',
          background: 'light-theme',
          color: 'light-theme-color',
        },
        {
          title: 'Red',
          title_ar: 'أحمر',
          background: 'red-theme',
          color: 'red-theme-color',
        },
        {
          title: 'Blue',
          title_ar: 'أزرق',
          background: 'blue-theme',
          color: 'blue-theme-color',
        },
        {
          title: 'Maroon',
          title_ar: 'كستنائي',
          background: 'maroon-theme',
          color: 'maroon-theme-color',
        },
        {
          title: 'Purple',
          title_ar: 'أرجواني',
          background: 'purple-theme',
          color: 'purple-theme-color',
        },
      ],
      sidebarColor: [
        {
          title: 'Light',
          title_ar: 'أبيض',
          background: 'sidebar-light-theme',
          color: 'sidebar-light-theme-color',
        },
        {
          title: 'Dark',
          title_ar: 'مظلم',
          background: 'sidebar-dark-theme',
          color: 'sidebar-dark-theme-color',
        },
        {
          title: 'Gradient',
          title_ar: 'متدرج',
          background: 'sidebar-gradient-theme',
          color: 'sidebar-gradient-theme-color',
        },
        // {
        //   title: 'Red',
        //   title_ar: 'أحمر',
        //   background: 'red-theme',
        //   color: 'red-theme-color',
        // },
      ],
      sidebarPosition: ['fixed', 'absolute'],
    };
  }
  ngOnInit() {}

  //set the theme layout
  setTheme(key: string, value: any) {
    // check if there is no theme settings in local storage
    if (!localStorage.getItem('mms-theme-settings')) {
      let updateDefaultSettings = { ...this.defaultSettings, [key]: value };
      localStorage.setItem(
        'mms-theme-settings',
        JSON.stringify(updateDefaultSettings)
      );
      this.themeData.next(JSON.stringify(updateDefaultSettings));
    }
    // if there is data update this theme settings
    else {
      let storedSettings: any = localStorage.getItem('mms-theme-settings');
      let settingsConverted = JSON.parse(storedSettings);
      let updateStoredSettings = { ...settingsConverted, [key]: value };
      localStorage.setItem(
        'mms-theme-settings',
        JSON.stringify(updateStoredSettings)
      );
      this.themeData.next(JSON.stringify(updateStoredSettings));
    }
  }

  //ser default theme settings
  setDefaultThemeSettings() {
    //set default theme
    if (!localStorage.getItem('mms-theme-settings')) {
      localStorage.setItem(
        'mms-theme-settings',
        JSON.stringify(this.defaultSettings)
      );
      this.themeData.next(JSON.stringify(this.defaultSettings));
    }
  }

  //get avilable themes
  getAvilableThemes(): any[] {
    return this.themeSettings;
  }
  //get current theme
  getCurrentTheme(): Observable<any> {
    return this.themeData.asObservable();
  }
}
