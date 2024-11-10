import { Component, OnInit } from '@angular/core';

//services

@Component({
  selector: 'app-header-messages',
  templateUrl: './header-messages.component.html',
  styleUrls: ['./header-messages.component.css'],
})
export class HeaderMessagesComponent implements OnInit {
  //variables initialization
  messages: any = [];
  constructor() {}

  ngOnInit() {
    this.getMessagesData();
  }
  // get notifications from notification services
  getMessagesData() {
  }
}
