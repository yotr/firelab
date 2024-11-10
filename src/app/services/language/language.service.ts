import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang: BehaviorSubject<string>;
  storedLang: any = localStorage.getItem('lang');

  constructor() {
    this.currentLang = new BehaviorSubject<string>(this.storedLang);
    this.currentLang.next(this.storedLang);
    // get language from local storage
  }
  //set language
  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.currentLang.next(lang);
  }
  // get language from local storage
  getCurrentLanguage(): Observable<string> {
    return this.currentLang.asObservable();
  }
}
