import { importProvidersFrom, NgModule } from '@angular/core';
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
import { GridTableComponent } from '../layouts/grid-table/grid-table.component';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './customers/components/add-customer/add-customer.component';
import { EditCustomerComponent } from './customers/components/edit-customer/edit-customer.component';
import { CustomersModuleTableComponent } from './customers/components/customers-module-table/customers-module-table.component';
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
import { MyJobsModuleTableComponent } from './jobs/components/my-jobs-module-table/my-jobs-module-table.component';
import { JobsMissedModuleTableComponent } from './jobs/components/jobs-missed-module-table/jobs-missed-module-table.component';
import { JobsDueModuleTableComponent } from './jobs/components/jobs-due-module-table/jobs-due-module-table.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';
import { ServiceRequestsModuleTableComponent } from './service-requests/components/service-requests-module-table/service-requests-module-table.component';
import { DeficienciesComponent } from './deficiencies/deficiencies.component';
import { DeficienciesModuleTableComponent } from './deficiencies/components/deficiencies-module-table/deficiencies-module-table.component';

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
    CustomersComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomersModuleTableComponent,
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
    MyJobsModuleTableComponent,
    JobsMissedModuleTableComponent,
    JobsDueModuleTableComponent,
    ServiceRequestsComponent,
    ServiceRequestsModuleTableComponent,
    DeficienciesComponent,
    DeficienciesModuleTableComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule,
    NgxDaterangepickerBootstrapModule.forRoot(),
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorInterceptor,
      multi: true,
    },
    NgxDaterangepickerLocaleService,
  ],
})
export class ModulesModule {}
