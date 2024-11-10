import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import pdf package
// import PDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import autoTable from 'jspdf-autotable';
// import { NgxPrintService, PrintOptions } from 'ngx-print';

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.css'],
})
export class DownloadPdfComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() dataKeys: any[] = [];
  @Input() tableTitle: string = '';
  @Output() onPrintAll: EventEmitter<any> = new EventEmitter();
  date: Date = new Date();
  testingTable: any;

  constructor() {
    this.testingTable = [
      { from: 'test', to: 'another test' },
      { from: 'test', to: 'another test' },
      { from: 'test', to: 'another test' },
      { from: 'test', to: 'another test' },
      { from: 'test', to: 'another test' },
      { from: 'test', to: 'another test' },
      { from: 'test', to: 'another test' },
    ];
  }

  ngOnInit() {}

  printAll() {
    //  when print all data
    this.onPrintAll.emit();
  }

  // // donload pdf file
  // downloadPdf(id?: string) {
  //   // html canva used here to mesure document width and height
  //   let pdf = new PDF('p', 'px', 'a4');

  //   html2canvas(document.getElementById('employees-table-img')).then(
  //     (canva) => {
  //       let contentUrl = canva.toDataURL('/image/png');
  //       let width = pdf.internal.pageSize.getWidth();
  //       let height = (canva.height * width) / canva.width;
  //       // pdf.html(document.getElementById('employees-table'), {
  //       //   html2canvas: {
  //       //     canvas: canva,
  //       //     width: width,
  //       //     height: (canva.height * width) / canva.width,
  //       //   },
  //       //   callback: (pdf) => {
  //       //     pdf.save('file.pdf');
  //       //   },
  //       // });
  //       pdf.addImage(contentUrl, 'PNG', 0, 0, width, height);
  //       pdf.save('file.pdf');
  //     }
  //   );
  // }
  //pdf as text
  // downloadPdf() {
  //   let pdf = new PDF('p', 'px', 'a4');
  //   // header of page
  //   autoTable(pdf, {
  //     body: [
  //       [
  //         {
  //           content: 'Logo',
  //         },
  //         {
  //           content: 'Invoice',
  //         },
  //       ],
  //     ],
  //     theme: 'plain',
  //   });

  //   // table
  //   autoTable(pdf, {
  //     html: '#employees-table',
  //     theme: 'striped',
  //     headStyles: {
  //       fillColor: 'black',
  //       fontSize: 9,
  //     },
  //     bodyStyles: {
  //       fontSize: 7,
  //     },
  //   });

  //   return pdf.save('file');
  // }

  // prind pdf
  // printAsPdf() {
  //   const customPrintOptions: PrintOptions = new PrintOptions({
  //     printSectionId: 'print-section',

  //     // Add any other print options as needed
  //   });
  //   this.printService.styleSheetFile =
  //     '../employees-table/employees-table.component.css';
  //   this.printService.print(customPrintOptions);
  // }
}
