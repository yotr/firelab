import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-building-info-modal',
  templateUrl: './add-building-info-modal.component.html',
  styleUrls: ['./add-building-info-modal.component.css'],
})
export class AddBuildingInfoModalComponent implements OnInit {
  @Input() currentTheme: any;
  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  addForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // update form
    this.addForm = this.formBuilder.group({
      // customer
      title: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit() {}
  // on attach files to be uploaded
  onSubmit() {
    this.onAdd.emit();
  }
}
