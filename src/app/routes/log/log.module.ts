import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { PipesModule } from 'app/pipes/pipes.module';

const COMPONENTS = [
  ];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
 
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class LogModule { }
