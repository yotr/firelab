import { Component, Input, OnInit } from '@angular/core';
// import xlsx package to export function
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css'],
})
export class ExportExcelComponent implements OnInit {
  @Input() data: any;
  @Input() elememtId: string = '';

  constructor() {}

  ngOnInit() {}

  // export shown table to execl file
  exportTableAsExcel() {
    // get table using id
    var table_elt = document.getElementById(this.elememtId);
    //generate workbook and add worksheet

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table_elt);

    // Process Data (add a new row)
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, 'table.xlsb');
  }

  // export all json data to execl file
  exportAllDataAsExcel() {
    //generate workbook and add worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    // Process Data (add a new row)
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, 'data.xlsb');
  }
}
