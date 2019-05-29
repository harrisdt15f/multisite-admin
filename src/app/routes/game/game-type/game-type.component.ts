import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { GameService } from 'app/service/game.service';

@Component({
  selector: 'app-game-game-type',
  templateUrl: './game-type.component.html',
  styleUrls: ['./game-type.component.less']

})
export class GameGameTypeComponent implements OnInit {
  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public is_load_list: boolean;
  public lotteries_tabs = [];
  constructor(
    private http: _HttpClient,

    private gameService: GameService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_lotteries_type();
  }

  /*
  *
  *获取采种系列
  *
  * @memberof UserManageUserComponent
  */
  get_lotteries_type() {
    this.gameService.get_lotteries_type().subscribe((res: any) => {
      if (res && res.success) {
        this.lotteries_tabs = [];
        for (let key in res.data) {
          this.lotteries_tabs.push({
            label: res.data[key],
            value: key
          }
          )
        }
        this.get_lotteries_list(this.lotteries_tabs[0].value,0)
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *切换tab
   *
   * @memberof GameGameTypeComponent
   */
  change_index(index: number) {
    if(this.lotteries_tabs[index].lotteries){
      this.list_of_aply_data =this.lotteries_tabs[index].lotteries;
    }else{
      this.get_lotteries_list(this.lotteries_tabs[index].value,index)
    }
    
  }



  /*
  *
  *获取采种列表
  *
  * @memberof UserManageUserComponent
  */
  get_lotteries_list(type,tab_index) {
    this.is_load_list = true;
    let option = {
      series_id: type
    };
    this.gameService.get_lotteries_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.is_load_list = false;
        this.list_of_aply_data = res.data;
        this.lotteries_tabs[tab_index].lotteries=res.data;

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

}
