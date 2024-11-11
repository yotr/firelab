import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-drop-file-section',
  templateUrl: './drop-file-section.component.html',
  styleUrls: ['./drop-file-section.component.css'],
})
export class DropFileSectionComponent implements OnInit {
  @Input() currentTheme: any;
  @Output() onAttach: EventEmitter<any> = new EventEmitter();
  files: File[] = [];
  loading: boolean = true;
  fileTypes: any = {};

  constructor() {
    this.fileTypes = {
      img: 'image',
      pdf: 'application/pdf',
      excel: 'excel',
      word: 'word',
      text: 'text',
      video: 'video',
      audio: 'audio',
      json: 'json',
      app: 'x-msdownload',
    };
  }

  ngOnInit() {}

  //get selected files form device
  getSelectedFiles(event: any) {
    if (event?.target?.files) {
      this.files = event?.target?.files;
      // this.onSelectFiles.emit(event?.target?.files);
      // get files as url
      // var reader = new FileReader();
      // reader.readAsDataURL(event.target.files[0]);
      // reader.onload = () => {
      //   this.fileURL = reader.result;
      //   this.uploadLoading = false;
      // };
    }
  }
  // on attach files to be uploaded
  onAttachFiles() {
    this.onAttach.emit(this.files);
    $('#drag_documents_files').modal('hide');
  }
  cancel() {
    this.files = [];
    $('#drag_documents_files').modal('hide');
  }

  removeFile(index: number) {
    const input: any = document.getElementById('files');
    // as an array, u have more freedom to transform the file list using array functions.
    const fileListArr: File[] = Array.from(this.files);
    fileListArr.splice(index, 1); // here u remove the file
    this.files = fileListArr;
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
