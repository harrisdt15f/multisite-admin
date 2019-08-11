import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ReportRoutingModule } from './report-routing.module';
import { ReportRechargeReportComponent } from './recharge-report/recharge-report.component';
import { ReportAccountReportComponent } from './account-report/account-report.component';
import { PipesModule } from 'app/pipes/pipes.module';
import { ReportUserBetsComponent } from './user-bets/user-bets.component';

const COMPONENTS = [
  ReportRechargeReportComponent,
  ReportAccountReportComponent,
  ReportUserBetsComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    ReportRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class ReportModule { }
