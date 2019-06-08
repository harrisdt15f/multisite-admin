import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerManagerCharacterComponent } from './manager-character/manager-character.component';
import { LogOperationLogComponent } from './operation-log/operation-log.component';
import { OperasyonOperasyonSettingComponent } from './operasyon-setting/operasyon-setting.component';
import { OperasyonActivityListComponent } from './activity-list/activity-list.component';
import { OperasyonCategoryManageComponent } from './category-manage/category-manage.component';
import { OperasyonArticleManageComponent } from './article-manage/article-manage.component';
import { OperasyonActivityTypeComponent } from './activity-type/activity-type.component';
import { OperasyonBankManageComponent } from './bank-manage/bank-manage.component';
import { OperasyonQuotaManageComponent } from './quota-manage/quota-manage.component';
import { OperasyonBannarComponent } from './bannar/bannar.component';
import { OperasyonPageModelComponent } from './page-model/page-model.component';
import { OperasyonNavOneComponent } from './nav-one/nav-one.component';
import { OperasyonNavTwoComponent } from './nav-two/nav-two.component';
import { OperasyonAnnouncementManageComponent } from './announcement-manage/announcement-manage.component';
import { OperasyonFrontendListComponent } from './frontend-list/frontend-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'manager-character'},
  { path: 'manager-character', component: ManagerManagerCharacterComponent },
  { path: 'operation-log', component: LogOperationLogComponent },
  { path: 'operasyon-setting', component: OperasyonOperasyonSettingComponent },
  { path: 'activity-list', component: OperasyonActivityListComponent },
  { path: 'category-manage', component: OperasyonCategoryManageComponent },
  { path: 'article-manage', component: OperasyonArticleManageComponent },
  { path: 'activity-type', component: OperasyonActivityTypeComponent },
  { path: 'bank-manage', component: OperasyonBankManageComponent },
  { path: 'quota-manage', component: OperasyonQuotaManageComponent },
  { path: 'bannar', component: OperasyonBannarComponent },
  { path: 'page-model', component: OperasyonPageModelComponent },
  { path: 'nav-one', component: OperasyonNavOneComponent },
  { path: 'nav-two', component: OperasyonNavTwoComponent },
  { path: 'announcement-manage', component: OperasyonAnnouncementManageComponent },
  { path: 'frontend-list', component: OperasyonFrontendListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperasyonRoutingModule { }
