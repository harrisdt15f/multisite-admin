import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeveloperDeveloperMenuComponent } from './developer-menu/developer-menu.component';
import { DeveloperDragComponent } from './drag/drag.component';
import { DeveloperBettingMenuComponent } from './betting-menu/betting-menu.component';

const routes: Routes = [
  { path: '', redirectTo: 'add-menu', pathMatch: 'full' },
  { path: 'add-menu', component: DeveloperDeveloperMenuComponent },
  { path: 'drag', component: DeveloperDragComponent },
  { path: 'betting-menu', component: DeveloperBettingMenuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeveloperRoutingModule { }
