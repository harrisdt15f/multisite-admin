import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreateGeneralAgentComponent } from './create-general-agent/create-general-agent.component';
import { UserPassportCheckComponent } from './passport-check/passport-check.component';
import { UserCapitalPassportCheckComponent } from './capital-passport-check/capital-passport-check.component';
import { UserManageUserComponent } from './manage-user/manage-user.component';
import { UserCityListComponent } from './city-list/city-list.component';
import { UserPrizeManageComponent } from './prize-manage/prize-manage.component';
import { UserRechargeComponent } from './recharge/recharge.component';
import { UserRechargeCheckComponent } from './recharge-check/recharge-check.component';
import { UserAccountTypeComponent } from './account-type/account-type.component';
import { ManageBankComponent } from './manage-bank/manage-bank.component';
import { UserWithdrawListComponent } from './withdraw-list/withdraw-list.component';

const routes: Routes = [
  { path: 'create-general-agent', component: UserCreateGeneralAgentComponent },
  { path: 'passport-check', component: UserPassportCheckComponent },
  { path: 'capital-passport-check', component: UserCapitalPassportCheckComponent },
  { path: 'manage-user', component: UserManageUserComponent },
  { path: 'city-list', component: UserCityListComponent },
  { path: 'prize-manage', component: UserPrizeManageComponent },
  { path: 'recharge', component: UserRechargeComponent },
  { path: 'recharge-check', component: UserRechargeCheckComponent },
  { path: 'account-type', component: UserAccountTypeComponent },
  { path: 'manage-bank', component: ManageBankComponent }
,
  { path: 'withdraw-list', component: UserWithdrawListComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
