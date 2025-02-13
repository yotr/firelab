import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { JobLinkComponent } from './job-link/job-link.component';
import { EditJobComponent } from './jobs/components/edit-job/edit-job.component';
import { AssignJobComponent } from './job-link/assign-job/assign-job.component';
import { EditAssignedJobComponent } from './job-link/edit-assigned-job/edit-assigned-job.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AddPermissionComponent } from './permissions/components/add-permission/add-permission.component';
import { EditPermissionComponent } from './permissions/components/edit-permission/edit-permission.component';
import { NoRoleComponent } from './no-role/no-role.component';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyComponent } from './companies/components/add-company/add-company.component';
import { EditCompanyComponent } from './companies/components/edit-company/edit-company.component';
import { companyGuard } from '../guards/company.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { pageGuard } from '../guards/page.guard';
import { authGuard } from '../guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AddDeficiencyComponent } from './deficiencies/components/add-deficiency/add-deficiency.component';
import { EditDeficiencyComponent } from './deficiencies/components/edit-deficiency/edit-deficiency.component';
import { AddServiceComponent } from './service-requests/components/add-service/add-service.component';
import { EditServiceComponent } from './service-requests/components/edit-service/edit-service.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/components/add-category/add-category.component';
import { EditCategoryComponent } from './categories/components/edit-category/edit-category.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { AddWarrantyComponent } from './warranty/components/add-warranty/add-warranty.component';
import { EditWarrantyComponent } from './warranty/components/edit-warranty/edit-warranty.component';
import { JobsComponent } from './jobs/jobs/jobs.component';
import { AssignedJobViewComponent } from './jobs/components/assigned-job-view/assigned-job-view.component';
import { WarrantyContractComponent } from './warranty-contract/warranty-contract.component';
import { AddWarrantyContractComponent } from './warranty-contract/components/add-warranty-contract/add-warranty-contract.component';
import { EditWarrantyContractComponent } from './warranty-contract/components/edit-warranty-contract/edit-warranty-contract.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { EditInvoiceComponent } from './invoices/components/edit-invoice/edit-invoice.component';
import { PaymentsComponent } from './payments/payments.component';
import { AddPaymentComponent } from './payments/components/add-payment/add-payment.component';
import { EditPaymentComponent } from './payments/components/edit-payment/edit-payment.component';

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
        // canActivate: [pageGuard],
        // data: { code: 'CRMM1P1', action: 'read' },
      },
      // customers
      {
        path: 'customers',
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomersModule),
      },
      // contract
      {
        path: 'contract',
        component: ContractComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM4P1', action: 'read' },
      },
      {
        path: 'contract/add',
        component: AddContractComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM4P1', action: 'create' },
      },
      {
        path: 'contract/edit/:id',
        component: EditContractComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM4P1', action: 'update' },
      },
      // team
      {
        path: 'team/allTeam',
        component: TeamComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM3P1', action: 'read' },
      },
      {
        path: 'team/add',
        component: AddTeamComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM3P1', action: 'create' },
      },
      {
        path: 'team/edit/:id',
        component: EditTeamComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM3P1', action: 'update' },
      },
      // timeCard
      {
        path: 'team/timeCard',
        component: TimeCardComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM3P2', action: 'read' },
      },
      {
        path: 'team/timeCard/:id',
        component: TimeCardDateRangeComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM3P2', action: 'update' },
      },
      // gps
      {
        path: 'team/gps',
        component: GpsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM3P3', action: 'read' },
      },
      // jobLink
      {
        path: 'jobLink',
        component: JobLinkComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM5P1', action: 'read' },
      },
      {
        path: 'jobLink/assignJob/:id',
        component: AssignJobComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM5P1', action: 'create' },
      },
      {
        path: 'jobLink/edit/:id',
        component: EditAssignedJobComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM5P1', action: 'update' },
      },
      // reports
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      // jobs
      {
        path: 'task/due',
        component: JobsDueComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM7P1', action: 'read' },
      },
      {
        path: 'task/missed',
        component: JobsMissedComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM7P2', action: 'read' },
      },
      {
        path: 'task/myJobs',
        component: MyJobsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM7P3', action: 'read' },
      },
      {
        path: 'task/myJobs/:id',
        component: AssignedJobViewComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM7P3', action: 'read' },
      },
      {
        path: 'task/edit/:id',
        component: EditJobComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM7P4', action: 'update' },
      },
      {
        path: 'task/jobs',
        component: JobsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM7P4', action: 'read' },
      },
      // services requests
      {
        path: 'serviceRequests',
        component: ServiceRequestsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM8P1', action: 'read' },
      },
      {
        path: 'serviceRequests/add',
        component: AddServiceComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM8P1', action: 'create' },
      },
      {
        path: 'serviceRequests/edit/:id',
        component: EditServiceComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM8P1', action: 'update' },
      },
      // Deficiencies
      {
        path: 'deficiencies',
        component: DeficienciesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM10P1', action: 'read' },
      },
      {
        path: 'deficiencies/add',
        component: AddDeficiencyComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM10P1', action: 'create' },
      },
      {
        path: 'deficiencies/edit/:id',
        component: EditDeficiencyComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM10P1', action: 'update' },
      },
      // Categories
      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM12P1', action: 'read' },
      },
      {
        path: 'categories/add',
        component: AddCategoryComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM12P1', action: 'create' },
      },
      {
        path: 'categories/edit/:id',
        component: EditCategoryComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM12P1', action: 'update' },
      },
      // warranty
      {
        path: 'warranty',
        component: WarrantyComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM13P1', action: 'read' },
      },
      {
        path: 'warranty/add',
        component: AddWarrantyComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM13P1', action: 'create' },
      },
      {
        path: 'warranty/edit/:id',
        component: EditWarrantyComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM13P1', action: 'update' },
      },
      // warranty contract
      {
        path: 'warranty-contract',
        component: WarrantyContractComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM14P1', action: 'read' },
      },
      {
        path: 'warranty-contract/add',
        component: AddWarrantyContractComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM14P1', action: 'create' },
      },
      {
        path: 'warranty-contract/edit/:id',
        component: EditWarrantyContractComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM14P1', action: 'update' },
      },
      // invoices
      {
        path: 'invoices',
        component: InvoicesComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM15P1', action: 'read' },
      },
      // {
      //   path: 'invoices/add',
      //   component: AddWarrantyComponent,
      //   canActivate: [pageGuard],
      //   data: { code: 'CRMM15P1', action: 'create' },
      // },
      {
        path: 'invoices/edit/:id',
        component: EditInvoiceComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM15P1', action: 'update' },
      },
      // payments
      {
        path: 'payments',
        component: PaymentsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM16P1', action: 'read' },
      },
      {
        path: 'payments/add',
        component: AddPaymentComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM16P1', action: 'create' },
      },
      {
        path: 'payments/edit/:id',
        component: EditPaymentComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM16P1', action: 'update' },
      },
      // reports
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory/inventory.module').then((m) => m.InventoryModule),
      },
      // permissions
      {
        path: 'permissions',
        component: PermissionsComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM11P1', action: 'read' },
      },
      {
        path: 'permissions/add',
        component: AddPermissionComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM11P1', action: 'create' },
      },
      {
        path: 'permissions/edit/:id',
        component: EditPermissionComponent,
        canActivate: [pageGuard],
        data: { code: 'CRMM11P1', action: 'update' },
      },
      // not role permissions
      {
        path: 'no-role',
        component: NoRoleComponent,
      },
      //company
      {
        path: 'companies',
        component: CompaniesComponent,
        canActivate: [companyGuard],
      },
      {
        path: 'companies/add',
        component: AddCompanyComponent,
        canActivate: [companyGuard],
      },
      {
        path: 'companies/edit/:id',
        component: EditCompanyComponent,
        canActivate: [companyGuard],
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
