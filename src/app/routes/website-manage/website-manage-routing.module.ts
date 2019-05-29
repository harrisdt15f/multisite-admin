import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebsiteManageLogoManageComponent } from './logo-manage/logo-manage.component';
import { WebsiteManageAdManageComponent } from './ad-manage/ad-manage.component';


const routes: Routes = [
  { path: '', redirectTo: 'logo-manage', pathMatch: 'full' },
  { path: 'logo-manage', component: WebsiteManageLogoManageComponent },
  { path: 'ad-manage', component: WebsiteManageAdManageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteManageRoutingModule { }
