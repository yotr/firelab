import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NewReportComponent } from './components/new-report/new-report.component';
import { CompletedReportsComponent } from './components/completed-reports/completed-reports.component';
import { IncompletedReportsComponent } from './components/incompleted-reports/incompleted-reports.component';
import { ReportClientDetailsComponent } from './components/new-report/components/report-client-details/report-client-details.component';
import { ReportDetailsComponent } from './components/new-report/components/report-details/report-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddReportDeviceModalComponent } from './components/new-report/components/add-report-device-modal/add-report-device-modal.component';

const routes: Routes = [
  {
    path: 'newReport',
    component: NewReportComponent,
  },
  {
    path: 'completedReports',
    component: CompletedReportsComponent,
  },
  {
    path: 'incompletedReports',
    component: IncompletedReportsComponent,
  },
  {
    path: 'reportClientDetail',
    component: ReportClientDetailsComponent,
  },
  {
    path: 'reportDetail/:id',
    component: ReportDetailsComponent,
  },
  {
    path: 'addReportDevice/:id',
    component: AddReportDeviceModalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
