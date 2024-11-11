import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NewReportComponent } from './components/new-report/new-report.component';
import { CompletedReportsComponent } from './components/completed-reports/completed-reports.component';
import { IncompletedReportsComponent } from './components/incompleted-reports/incompleted-reports.component';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsModuleTableComponent } from './components/reports-module-table/reports-module-table.component';


@NgModule({
  declarations: [
    ReportsComponent,
    NewReportComponent,
    CompletedReportsComponent,
    IncompletedReportsComponent,
    ReportsModuleTableComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }
