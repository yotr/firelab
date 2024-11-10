import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  email: any = null;
  token: any = null;

  constructor(
    private formBuilder: FormBuilder,
    // private apiService: ApiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    //get querys
    this.activatedRoute.queryParamMap.subscribe((paramMap: Params) => {
      this.email = paramMap['get']('email');
      this.token = paramMap['get']('token');
    });
    // login form group controls
    this.forgetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      // { validators: passwordMatch }
    );
  }

  ngOnInit() {}

  submit() {
    // if (this.forgetPasswordForm.valid) {
    //   let object: any = {
    //     token: this.token,
    //     email: this.email,
    //     password: this.forgetPasswordForm.get('password').value,
    //   };
    //   console.log(object);
    //   // // send the data to server
    //   this.apiService.add('users/resetPassword', object).subscribe({
    //     next: (data) => {
    //       console.log(data);
    //       if (data.ok) {
    //         this.toastr.success('Password Changed');
    //       }
    //     },
    //     error: (error) => {
    //       this.toastr.error('there is something wrong', 'Error');
    //     },
    //     complete: () => {
    //       this.forgetPasswordForm.reset();
    //     },
    //   });
    // } else {
    //   this.toastr.error('', 'Please enter mandatory field!');
    // }
  }

  openLink() {
    window.open('https://www.aktitec.com/');
  }
}
