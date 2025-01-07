import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, range, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Api Methods
  public apiurl = 'assets/json';

  //using Observable service to share status of sidebar between all components
  private isSidebarOpend: BehaviorSubject<boolean>;
  private activeDropdown: BehaviorSubject<string>;
  // for customer pages
  private currentCustomerId: BehaviorSubject<any>;
  // for user roles
  private roles: BehaviorSubject<any>;
  sidebarLinks: any = [];

  constructor(private http: HttpClient) {
    //define init variables
    this.isSidebarOpend = new BehaviorSubject<boolean>(false);
    this.activeDropdown = new BehaviorSubject<string>('');
    // for customer pages
    this.currentCustomerId = new BehaviorSubject<any>('');
    this.roles = new BehaviorSubject<any>({});
    this.http
      .get<any>(`${this.apiurl}/sidebar-en.json`)
      .subscribe((response: any) => {
        this.sidebarLinks = response;
      });
  }

  open() {
    //send observable value  by false to isSidebarOpend variable
    this.isSidebarOpend.next(false);
  }

  close() {
    this.isSidebarOpend.next(true);
  }
  // get if it closed or opened
  getSidebarStatus(): Observable<boolean> {
    return this.isSidebarOpend.asObservable();
  }
  // get sidebar links
  getSidebarMenuEnglish(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/sidebar-en.json`);
  }
  getSidebarMenuArabic(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/sidebar-ar.json`);
  }
  getDefaultSidebarMenuSelected(): any {
    return this.sidebarLinks[0]?.menu;
  }

  // send name of active dropdown to know which one active
  sendActiveDropdown(value: string) {
    if (value == this.activeDropdown.value) {
      this.activeDropdown.next('');
    } else {
      this.activeDropdown.next(value);
    }
  }
  // send name of active dropdown to know which one active
  activateDropdown(value: string) {
    this.activeDropdown.next(value);
  }
  // send name of active dropdown to know which one active
  deActivateDropdown(value: string) {
    this.activeDropdown.next('');
  }
  //get active as observable
  getActiveDropdownValue(): Observable<string> {
    return this.activeDropdown.asObservable();
  }
  // for customer pages

  sendCurrentCustomer(value: any) {
    this.currentCustomerId.next(value);
  }
  //get active as observable
  getCurrentCustomerValue(): Observable<string> {
    return this.currentCustomerId.asObservable();
  }

  sendActiveDropdownPage(value: any) {
    this.activeDropdown.next(value);
  }

  // for roles pages
  sendRoles(value: any) {
    this.roles.next(value);
  }
  //get active as observable
  getRoles(): Observable<string> {
    return this.roles.asObservable();
  }
}
