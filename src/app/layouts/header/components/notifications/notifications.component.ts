import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { ApiService } from 'src/app/services/api/api.service';

//services
// import { SignalrService } from 'src/app/services/signalr/signalr.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  //variables initialization
  notifications: any[] = [];
  currentUser: any = {} as any;

  constructor(
    // private apiService: ApiService,
    private toastr: ToastrService,
    // private signalRService: SignalrService
  ) {
    // signal R connection test
    // this.signalRService.startConnection();
    // this.signalRService.addReceiveMessageListener((user, message) => {
    //   console.log(`Message received from ${user}: ${message}`);
    //   // Handle incoming messages
    //   this.toastr.warning(message);
    //   // this.pushNotification(message);
    // });
  }

  ngOnInit() {}

  // get current user
  getCurrentUser() {
    let user = localStorage.getItem('firelab-loginData');
    if (user) {
      let data = JSON?.parse(user);
      this.currentUser = data?.userData;
    }
  }
  // get notifications from notification services
  // getNotificationsData() {
  //   this.notificationsService
  //     .getAllNotifications()
  //     .subscribe((notification) => {
  //       this.notifications = notification;
  //     });
  // }
  //send a new notification
  getNotificcations() {
    let sent = false;
    // send the data to server
    // this.apiService
    //   .get(`notifications/GetReceivedNotifications/${this.currentUser?.id}`)
    //   .subscribe({
    //     next: (data) => {
    //       sent = true;
    //       console.log(data);
    //       this.notifications = data;
    //     },
    //     error: (error) => {
    //       this.toastr.error('there is something wrong', 'Error');
    //     },
    //     complete: () => {
    //       if (sent) {
    //         this.toastr.success('Notification Sent', 'Success');
    //       }
    //     },
    //   });
  }

  pushNotification(notification: any) {
    this.notifications.push(notification);
  }

  textLength(text: string, length: number) {
    return text?.substring(0, length);
  }
}
