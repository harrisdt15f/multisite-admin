import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalPersonalCenterComponent } from './personal-center/personal-center.component';

const routes: Routes = [

  { path: 'personal_center', component: PersonalPersonalCenterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
