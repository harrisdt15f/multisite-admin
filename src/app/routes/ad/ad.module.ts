import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AdRoutingModule } from './ad-routing.module';
import { AdAdTypeComponent } from './ad-type/ad-type.component';

const COMPONENTS = [
  AdAdTypeComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    AdRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class AdModule { }
