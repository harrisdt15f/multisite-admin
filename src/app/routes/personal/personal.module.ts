import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalPersonalCenterComponent } from './personal-center/personal-center.component';

const COMPONENTS = [
  PersonalPersonalCenterComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PersonalRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PersonalModule { }
