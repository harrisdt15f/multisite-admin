import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DeveloperRoutingModule } from './developer-routing.module';
import { DeveloperDeveloperMenuComponent } from './developer-menu/developer-menu.component';
import { DeveloperDragComponent } from './drag/drag.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DeveloperBettingMenuComponent } from './betting-menu/betting-menu.component';

const COMPONENTS = [
  DeveloperDeveloperMenuComponent,
  DeveloperDragComponent,
  DeveloperBettingMenuComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    DragDropModule,

    DeveloperRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class DeveloperModule { }
