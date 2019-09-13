import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UserRoutingModule } from './user-routing.module';
import { UserCreateGeneralAgentComponent } from './create-general-agent/create-general-agent.component';
import { UserPassportCheckComponent } from './passport-check/passport-check.component';
import { UserCapitalPassportCheckComponent } from './capital-passport-check/capital-passport-check.component';
import { UserManageUserComponent } from './manage-user/manage-user.component';
import { LevelDeepPipe } from 'app/pipes/level-deep.pipe';
import { PipesModule } from 'app/pipes/pipes.module';
import { UserCityListComponent } from './city-list/city-list.component';
import { UserPrizeManageComponent } from './prize-manage/prize-manage.component';
import { UserRechargeComponent } from './recharge/recharge.component';
import { UserRechargeCheckComponent } from './recharge-check/recharge-check.component';
import { UserAccountTypeComponent } from './account-type/account-type.component';
import { ManageBankComponent } from './manage-bank/manage-bank.component';
import { UserWithdrawListComponent } from './withdraw-list/withdraw-list.component';

const COMPONENTS = [
  UserCreateGeneralAgentComponent,
  UserPassportCheckComponent,
  UserCapitalPassportCheckComponent,
  UserManageUserComponent,
  UserCityListComponent,
  UserPrizeManageComponent,
  UserRechargeComponent,
  UserRechargeCheckComponent,
  UserAccountTypeComponent,
  ManageBankComponent,
  UserWithdrawListComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    UserRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class UserModule { }
