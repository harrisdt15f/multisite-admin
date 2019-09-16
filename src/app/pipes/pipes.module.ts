import { NgModule } from '@angular/core';
import { LevelDeepPipe } from './level-deep.pipe';
import { FrozenTypePipe } from './frozen-type.pipe';
import { CheckStatusPipe } from './check-passport-status';
import { ValidModesPipe } from './valid_modes.pipe';
import { IssueTypePipe } from './issue_type.pipe';
import { GameTypePipe } from './game-type.pipe';
import { EquipmentTypePipe } from './equipment-type.pipe';
import { DateChangePipe } from './date_change.pipe';
import { PayTypePipe } from './pay-type.pipe';
import { RechargeStatusPipe } from './recharge-status';
import { UserBetPipe } from './user-bet.pipe';
import { NnitPipe } from './unit.pipe';
import { BetNumber } from './bet_number_change.pip';
import { IfTimeEndPipe } from './if-time-end.pip';

@NgModule({
    declarations:
        [
            LevelDeepPipe,
            IfTimeEndPipe,
            NnitPipe,
            UserBetPipe,
            FrozenTypePipe,
            PayTypePipe,
            ValidModesPipe,
            IssueTypePipe,
            GameTypePipe,
            EquipmentTypePipe,
            DateChangePipe,
            RechargeStatusPipe,
            BetNumber,
            CheckStatusPipe
        ],
    imports: [],
    exports:
        [
            NnitPipe,
            UserBetPipe,
            LevelDeepPipe,
            IfTimeEndPipe,
            FrozenTypePipe,
            RechargeStatusPipe,
            ValidModesPipe,
            EquipmentTypePipe,
            BetNumber,
            DateChangePipe,
            PayTypePipe,
            IssueTypePipe,
            GameTypePipe,
            CheckStatusPipe
        ]
})
export class PipesModule { }
