import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NewReportComponent } from './components/new-report/new-report.component';
import { CompletedReportsComponent } from './components/completed-reports/completed-reports.component';
import { IncompletedReportsComponent } from './components/incompleted-reports/incompleted-reports.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
