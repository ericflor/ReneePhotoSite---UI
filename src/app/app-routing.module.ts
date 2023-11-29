import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomepageComponent } from './components/user-homepage/user-homepage.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'user-homepage', component: UserHomepageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
