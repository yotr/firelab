import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-choose-modal',
  templateUrl: './choose-modal.component.html',
  styleUrls: ['./choose-modal.component.css'],
})
export class ChooseModalComponent implements OnInit {
  @Input() id: any = null;
  constructor(private router: Router) {}

  ngOnInit() {}

  assignJob() {
    $('#choose_modal').modal('hide');
    this.router.navigate(['/modules/jobLink/assignJob', this.id]);
  }

}
