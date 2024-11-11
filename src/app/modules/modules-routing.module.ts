import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { AddCustomerComponent } from './customers/components/add-customer/add-customer.component';
import { EditCustomerComponent } from './customers/components/edit-customer/edit-customer.component';
import { ContractComponent } from './contract/contract.component';
import { AddContractComponent } from './contract/components/add-contract/add-contract.component';
import { EditContractComponent } from './contract/components/edit-contract/edit-contract.component';
import { TeamComponent } from './team/team.component';
import { AddTeamComponent } from './team/components/add-team/add-team.component';
import { EditTeamComponent } from './team/components/edit-team/edit-team.component';
import { TimeCardComponent } from './time-card/time-card.component';
import { TimeCardDateRangeComponent } from './time-card/components/time-card-date-range/time-card-date-range.component';
import { GpsComponent } from './gps/gps.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';
import { MyJobsComponent } from './jobs/my-jobs/my-jobs.component';
import { JobsMissedComponent } from './jobs/jobs-missed/jobs-missed.component';
import { JobsDueComponent } from './jobs/jobs-due/jobs-due.component';
import { DeficienciesComponent } from './deficiencies/deficiencies.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // main module and main layout for modules
  {
    path: '',
    component: ModulesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      // customers
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'customers/add',
        component: AddCustomerComponent,
      },
      {
        path: 'customers/edit/:id',
        component: EditCustomerComponent,
      },
      // contract
      {
        path: 'contract',
        component: ContractComponent,
      },
      {
        path: 'contract/add',
        component: AddContractComponent,
      },
      {
        path: 'contract/edit/:id',
        component: EditContractComponent,
      },
      // team
      {
        path: 'team',
        component: TeamComponent,
      },
      {
        path: 'team/add',
        component: AddTeamComponent,
      },
      {
        path: 'team/edit/:id',
        component: EditTeamComponent,
      },
      // timeCard
      {
        path: 'team/timeCard',
        component: TimeCardComponent,
      },
      {
        path: 'team/timeCard/:id',
        component: TimeCardDateRangeComponent,
      },
      // gps
      {
        path: 'team/gps',
        component: GpsComponent,
      },
      // jobs
      {
        path: 'task/due',
        component: JobsDueComponent,
      },
      {
        path: 'task/missed',
        component: JobsMissedComponent,
      },
      {
        path: 'task/myJobs',
        component: MyJobsComponent,
      },
      // services requests
      {
        path: 'serviceRequests',
        component: ServiceRequestsComponent,
      },
      // Deficiencies
      {
        path: 'deficiencies',
        component: DeficienciesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
