import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptorInterceptor } from '../interceptor/token-interceptor.interceptor';
import { ModulesComponent } from './modules.component';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { HeaderSearchComponent } from '../layouts/header/components/header-search/header-search.component';
import { LanguageDropdownComponent } from '../layouts/header/components/language-dropdown/language-dropdown.component';
import { NotificationsComponent } from '../layouts/header/components/notifications/notifications.component';
import { HeaderMessagesComponent } from '../layouts/header/components/header-messages/header-messages.component';
import { UserDropdownComponent } from '../layouts/header/components/user-dropdown/user-dropdown.component';
import { ThemeSettingsComponent } from '../layouts/theme-settings/theme-settings.component';
import { SidebarDropdownComponent } from '../layouts/sidebar/components/sidebar-dropdown/sidebar-dropdown.component';
import { SidebarLinkComponent } from '../layouts/sidebar/components/sidebar-link/sidebar-link.component';
import { EditContractComponent } from './contract/components/edit-contract/edit-contract.component';
import { AddContractComponent } from './contract/components/add-contract/add-contract.component';
import { ContractComponent } from './contract/contract.component';
import { ContractModuleTableComponent } from './contract/components/contract-module-table/contract-module-table.component';
import { TeamComponent } from './team/team.component';
import { TeamModuleTableComponent } from './team/components/team-module-table/team-module-table.component';
import { AddTeamComponent } from './team/components/add-team/add-team.component';
import { EditTeamComponent } from './team/components/edit-team/edit-team.component';
import { TimeCardDateRangeComponent } from './time-card/components/time-card-date-range/time-card-date-range.component';
import { TimeCardModuleTableComponent } from './time-card/components/time-card-module-table/time-card-module-table.component';
import { TimeCardComponent } from './time-card/time-card.component';
import {
  NgxDaterangepickerBootstrapModule,
  NgxDaterangepickerLocaleService,
} from 'ngx-daterangepicker-bootstrap';
import { GpsComponent } from './gps/gps.component';
import { JobsDueComponent } from './jobs/jobs-due/jobs-due.component';
import { MyJobsComponent } from './jobs/my-jobs/my-jobs.component';
import { JobsMissedComponent } from './jobs/jobs-missed/jobs-missed.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';
import { ServiceRequestsModuleTableComponent } from './service-requests/components/service-requests-module-table/service-requests-module-table.component';
import { DeficienciesComponent } from './deficiencies/deficiencies.component';
import { DeficienciesModuleTableComponent } from './deficiencies/components/deficiencies-module-table/deficiencies-module-table.component';
import { JobLinkComponent } from './job-link/job-link.component';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { UndoService } from '../services/jobLink/undo.service';
import { DataService } from '../services/jobLink/data.service';
import { EditJobComponent } from './jobs/components/edit-job/edit-job.component';
import { JobListComponent } from './job-link/job-list/job-list.component';
import { ChooseModalComponent } from './job-link/choose-modal/choose-modal.component';
import { AssignJobComponent } from './job-link/assign-job/assign-job.component';
import { EditAssignedJobComponent } from './job-link/edit-assigned-job/edit-assigned-job.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsJobModuleTableComponent } from './jobs/components/jobs-job-module-table/jobs-job-module-table.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AddPermissionComponent } from './permissions/components/add-permission/add-permission.component';
import { EditPermissionComponent } from './permissions/components/edit-permission/edit-permission.component';
import { PermissionsModuleTableComponent } from './permissions/components/permissions-module-table/permissions-module-table.component';
import { ModuleSectionComponent } from './permissions/components/module-section/module-section.component';
import { EditModuleSectionComponent } from './permissions/components/edit-module-section/edit-module-section.component';
import { NoRoleComponent } from './no-role/no-role.component';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './companies/components/add-company/add-company.component';
import { EditCompanyComponent } from './companies/components/edit-company/edit-company.component';
import { CompanyModuleTableComponent } from './companies/components/company-module-table/company-module-table.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { AddDeficiencyComponent } from './deficiencies/components/add-deficiency/add-deficiency.component';
import { EditDeficiencyComponent } from './deficiencies/components/edit-deficiency/edit-deficiency.component';
import { AddServiceComponent } from './service-requests/components/add-service/add-service.component';
import { EditServiceComponent } from './service-requests/components/edit-service/edit-service.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/components/add-category/add-category.component';
import { EditCategoryComponent } from './categories/components/edit-category/edit-category.component';
import { CategoryModuleTableComponent } from './categories/components/category-module-table/category-module-table.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { WarrantyModuleTableComponent } from './warranty/components/warranty-module-table/warranty-module-table.component';
import { AddWarrantyComponent } from './warranty/components/add-warranty/add-warranty.component';
import { EditWarrantyComponent } from './warranty/components/edit-warranty/edit-warranty.component';
import { JobLinkModuleTableComponent } from './job-link/job-link-module-table/job-link-module-table.component';
import { JobsComponent } from './jobs/jobs/jobs.component';
import { AddServiceModalComponent } from './job-link/add-service-modal/add-service-modal.component';

@NgModule({
  declarations: [
    ModulesComponent,
    SidebarDropdownComponent,
    SidebarLinkComponent,
    SidebarComponent,
    HeaderComponent,
    HeaderSearchComponent,
    LanguageDropdownComponent,
    NotificationsComponent,
    HeaderMessagesComponent,
    UserDropdownComponent,
    ThemeSettingsComponent,
    DashboardComponent,
    ContractComponent,
    ContractModuleTableComponent,
    AddContractComponent,
    EditContractComponent,
    TeamComponent,
    TeamModuleTableComponent,
    AddTeamComponent,
    EditTeamComponent,
    TimeCardComponent,
    TimeCardDateRangeComponent,
    TimeCardModuleTableComponent,
    GpsComponent,
    JobsDueComponent,
    MyJobsComponent,
    JobsMissedComponent,
    EditJobComponent,
    JobsJobModuleTableComponent,
    ServiceRequestsComponent,
    ServiceRequestsModuleTableComponent,
    DeficienciesComponent,
    DeficienciesModuleTableComponent,
    JobLinkComponent,
    JobListComponent,
    ChooseModalComponent,
    AssignJobComponent,
    EditAssignedJobComponent,
    PermissionsComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    PermissionsModuleTableComponent,
    ModuleSectionComponent,
    EditModuleSectionComponent,
    CompaniesComponent,
    AddCompanyComponent,
    EditCompanyComponent,
    CompanyModuleTableComponent,
    NoRoleComponent,
    ChangePasswordComponent,
    ProfileComponent,
    AddDeficiencyComponent,
    EditDeficiencyComponent,
    AddServiceComponent,
    EditServiceComponent,
    CategoriesComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    CategoryModuleTableComponent,
    WarrantyComponent,
    WarrantyModuleTableComponent,
    AddWarrantyComponent,
    EditWarrantyComponent,
    JobLinkModuleTableComponent,
    JobsComponent,
    AddServiceModalComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule,
    NgxDaterangepickerBootstrapModule.forRoot(),
    DayPilotModule,
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorInterceptor,
      multi: true,
    },
    NgxDaterangepickerLocaleService,
    DataService,
    UndoService,
  ],
})
export class ModulesModule {}
