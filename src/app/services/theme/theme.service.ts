import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnInit {
  // array of theme
  themeSettings: any = {};
  private themeData: BehaviorSubject<string>;
  storedThemes: any = localStorage.getItem('firelab-theme-settings');
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
          background: 'orange-theme',
          color: 'orange-theme-color',
        },
        {
          title: 'Light',
          background: 'light-theme',
          color: 'light-theme-color',
        },
        {
          title: 'Red',
          background: 'red-theme',
          color: 'red-theme-color',
        },
        {
          title: 'Blue',
          background: 'blue-theme',
          color: 'blue-theme-color',
        },
        {
          title: 'Maroon',
          background: 'maroon-theme',
          color: 'maroon-theme-color',
        },
        {
          title: 'Purple',
          background: 'purple-theme',
          color: 'purple-theme-color',
        },
      ],
      sidebarColor: [
        {
          title: 'Light',
          background: 'sidebar-light-theme',
          color: 'sidebar-light-theme-color',
        },
        {
          title: 'Dark',
          background: 'sidebar-dark-theme',
          color: 'sidebar-dark-theme-color',
        },
        {
          title: 'Gradient',
          background: 'sidebar-gradient-theme',
          color: 'sidebar-gradient-theme-color',
        },
      ],
      sidebarPosition: ['fixed', 'absolute'],
    };
  }
  ngOnInit() {}

  //set the theme layout
  setTheme(key: string, value: any) {
    // check if there is no theme settings in local storage
    if (!localStorage.getItem('firelab-theme-settings')) {
      let updateDefaultSettings = { ...this.defaultSettings, [key]: value };
      localStorage.setItem(
        'firelab-theme-settings',
        JSON.stringify(updateDefaultSettings)
      );
      this.themeData.next(JSON.stringify(updateDefaultSettings));
    }
    // if there is data update this theme settings
    else {
      let storedSettings: any = localStorage.getItem('firelab-theme-settings');
      let settingsConverted = JSON.parse(storedSettings);
      let updateStoredSettings = { ...settingsConverted, [key]: value };
      localStorage.setItem(
        'firelab-theme-settings',
        JSON.stringify(updateStoredSettings)
      );
      this.themeData.next(JSON.stringify(updateStoredSettings));
    }
  }

  //ser default theme settings
  setDefaultThemeSettings() {
    //set default theme
    if (!localStorage.getItem('firelab-theme-settings')) {
      localStorage.setItem(
        'firelab-theme-settings',
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
