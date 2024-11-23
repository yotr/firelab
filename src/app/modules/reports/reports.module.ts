import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { NewReportComponent } from './components/new-report/new-report.component';
import { CompletedReportsComponent } from './components/completed-reports/completed-reports.component';
import { IncompletedReportsComponent } from './components/incompleted-reports/incompleted-reports.component';
import { ReportsComponent } from './reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsModuleTableComponent } from './components/reports-module-table/reports-module-table.component';
import { ReportClientDetailsComponent } from './components/new-report/components/report-client-details/report-client-details.component';
import { NewCopyReportModalComponent } from './components/new-report/components/new-copy-report-modal/new-copy-report-modal.component';
import { ReportDetailsComponent } from './components/new-report/components/report-details/report-details.component';
import { StartReportModalComponent } from './components/new-report/components/start-report-modal/start-report-modal.component';
import { ConfirmationModalComponent } from './components/new-report/components/confirmation-modal/confirmation-modal.component';
import { ReportTabsComponent } from './components/new-report/components/report-tabs/report-tabs.component';
import { CustomQuestionsComponent } from './components/new-report/components/report-tabs/components/custom-questions/custom-questions.component';
import { AddCustomQuestionComponent } from './components/new-report/components/report-tabs/components/add-custom-question/add-custom-question.component';

@NgModule({
  declarations: [
    ReportsComponent,
    NewReportComponent,
    CompletedReportsComponent,
    IncompletedReportsComponent,
    ReportsModuleTableComponent,
    ReportClientDetailsComponent,
    NewCopyReportModalComponent,
    ReportDetailsComponent,
    StartReportModalComponent,
    ConfirmationModalComponent,
    ReportTabsComponent,
    CustomQuestionsComponent,
    AddCustomQuestionComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
