import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    // private apiService: ApiService,
    private toastr: ToastrService
  ) {
    // login form group controls
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  submit() {
    // if (this.forgetPasswordForm.valid) {
    //   let object: any = {
    //     email: this.forgetPasswordForm.get('email').value,
    //   };
    //   // // send the data to server
    //   this.apiService
    //     .add(`users/forgotPassword?email=${object?.email}`, {})
    //     .subscribe({
    //       next: (data: any) => {
    //         console.log(data);
    //         this.toastr.success('You are receiving email ', 'Success');
    //       },
    //       error: (error: any) => {
    //         this.toastr.error('there is something wrong', 'Error');
    //       },
    //       complete: () => {
    //         this.forgetPasswordForm.reset();
    //       },
    //     });
    // } else {
    //   this.toastr.error('', 'Please enter mandatory field!');
    // }
  }

  openLink() {
    window.open('https://www.aktitec.com/');
  }
}
