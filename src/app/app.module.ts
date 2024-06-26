import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './components/users/users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatCardModule as MatCardModule } from '@angular/material/card';
import { MatProgressBarModule as MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule as MatTableModule } from '@angular/material/table';
import { UserHomepageComponent } from './components/user-homepage/user-homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminComponent } from './components/admin/admin.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MatPaginatorModule as MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule as MatSelectModule } from '@angular/material/select';
import { OrdersComponent } from './components/orders/orders.component';
import { AgencyComponent } from './components/agency/agency.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditOrderFormComponent } from './components/edit-order-form/edit-order-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateAgencyDialogComponent } from './components/create-agency-dialog/create-agency-dialog.component';
import { EditAgencyDialogComponent } from './components/edit-agency-dialog/edit-agency-dialog.component';
import { UploadComponent } from './components/upload/upload.component';
import { AssignComponent } from './components/assign/assign.component';
import { ReportsComponent } from './components/reports/reports.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EditPhoneFormComponent } from './components/edit-phone-form/edit-phone-form.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserHomepageComponent,
    NavbarComponent,
    AdminComponent,
    InventoryComponent,
    OrdersComponent,
    AgencyComponent,
    EditOrderFormComponent,
    CreateAgencyDialogComponent,
    EditAgencyDialogComponent,
    UploadComponent,
    AssignComponent,
    ReportsComponent,
    EditPhoneFormComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
