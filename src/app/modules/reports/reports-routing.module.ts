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
import { pageGuard } from 'src/app/guards/page.guard';

const routes: Routes = [
  {
    path: 'newReport',
    component: NewReportComponent,
    canActivate: [pageGuard],
    data: { code: 'CRMM6P2', action: 'read' },
  },
  {
    path: 'completedReports',
    component: CompletedReportsComponent,
    canActivate: [pageGuard],
    data: { code: 'CRMM6P3', action: 'read' },
  },
  {
    path: 'incompletedReports',
    component: IncompletedReportsComponent,
    canActivate: [pageGuard],
    data: { code: 'CRMM6P4', action: 'read' },
  },
  {
    path: 'reportClientDetail',
    component: ReportClientDetailsComponent,
    canActivate: [pageGuard],
    data: { code: 'CRMM6P2', action: 'create' },
  },
  {
    path: 'reportDetail/:id',
    component: ReportDetailsComponent,
    canActivate: [pageGuard],
    data: { code: 'CRMM6P2', action: 'update' },
  },
  {
    path: 'addReportDevice/:id',
    component: AddReportDeviceModalComponent,
    canActivate: [pageGuard],
    data: { code: 'CRMM6P2', action: 'create' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
