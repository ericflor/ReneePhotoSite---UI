import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomepageComponent } from './components/user-homepage/user-homepage.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuardService } from './services/authGuard.service';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AgencyComponent } from './components/agency/agency.component';
import { UploadComponent } from './components/upload/upload.component';
import { AssignComponent } from './components/assign/assign.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'user-homepage', component: UserHomepageComponent, canActivate: [AuthGuardService] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuardService] },
  { path: 'upload', component: UploadComponent },
  { path: 'assign', component: AssignComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuardService] },
  { path: 'agencies', component: AgencyComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: UsersComponent },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
