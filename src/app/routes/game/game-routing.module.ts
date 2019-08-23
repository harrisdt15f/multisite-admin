import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameGameTypeComponent } from './game-type/game-type.component';
import { GameGamePlayComponent } from './game-play/game-play.component';
import { GameLotteryIssueComponent } from './lottery-issue/lottery-issue.component';
import { LotterySeriesComponent } from './lottery-series/lottery-series.component';

const routes: Routes = [

  { path: 'game-type', component: GameGameTypeComponent },
  { path: 'game-play', component: GameGamePlayComponent },
  { path: 'lottery-series', component: LotterySeriesComponent },
  { path: 'lottery-issue', component: GameLotteryIssueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
