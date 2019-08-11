import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { GameRoutingModule } from './game-routing.module';
import { GameGameTypeComponent } from './game-type/game-type.component';
import { PipesModule } from 'app/pipes/pipes.module';
import { GameGamePlayComponent } from './game-play/game-play.component';
import { GameLotteryIssueComponent } from './lottery-issue/lottery-issue.component';
import { CronEditorModule } from "cron-editor";
const COMPONENTS = [
  GameGameTypeComponent,
  GameGamePlayComponent,
  GameLotteryIssueComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    CronEditorModule,
    GameRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class GameModule { }
