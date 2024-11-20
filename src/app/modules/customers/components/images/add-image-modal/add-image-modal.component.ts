import { Component, EventEmitter, OnInit, Output } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-add-image-modal',
  templateUrl: './add-image-modal.component.html',
  styleUrls: ['./add-image-modal.component.css'],
})
export class AddImageModalComponent implements OnInit {
  @Output() onAttach: EventEmitter<any> = new EventEmitter();
  file: any = null;
  fileURL: any = null;
  loading: boolean = true;

  constructor() {}

  ngOnInit() {}

  //get selected files form device

  getSelectedFiles(event: any) {
    this.loading = true;
    if (event?.target?.files) {
      this.file = event?.target?.files[0];
      // this.onSelectFiles.emit(event?.target?.files);
      // get files as url
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.fileURL = reader.result;
        this.loading = false;
      };
    }
  }
  // on attach files to be uploaded
  onAttachImage() {
    this.onAttach.emit(this.fileURL);
    $('#add_image').modal('hide');
  }
  cancel() {
    this.file = null;
    $('#add_image').modal('hide');
  }

  // format bytes
  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
