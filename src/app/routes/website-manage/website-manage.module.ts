import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { WebsiteManageRoutingModule } from './website-manage-routing.module';
import { WebsiteManageLogoManageComponent } from './logo-manage/logo-manage.component';
import { WebsiteManageAdManageComponent } from './ad-manage/ad-manage.component';


const COMPONENTS = [
  WebsiteManageLogoManageComponent,
  WebsiteManageAdManageComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    WebsiteManageRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class WebsiteManageModule { }
