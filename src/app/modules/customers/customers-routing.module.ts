import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { CustomersComponent } from './customers.component';
import { AllCustomersComponent } from './components/all-customers/all-customers.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    children: [
      {
        path: 'allCustomers',
        component: AllCustomersComponent,
      },
      {
        path: 'add',
        component: AddCustomerComponent,
      },
      {
        path: 'edit/:id',
        component: EditCustomerComponent,
      },
      {
        path: 'home/:id',
        component: CustomerHomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
