import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-add-note-modal',
  templateUrl: './add-note-modal.component.html',
  styleUrls: ['./add-note-modal.component.css'],
})
export class AddNoteModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}


  saveAndNew() {
    $('#add_note_modal').modal('hide');
  }
  save() {
    $('#add_note_modal').modal('hide');
  }
}
