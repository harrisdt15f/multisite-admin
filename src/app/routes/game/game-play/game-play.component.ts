import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { GameService } from 'app/service/game.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';

@Component({
  selector: 'app-game-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.less']
})
export class GameGamePlayComponent implements OnInit {
  public first_level: Array<any> = [];
  public second_level: Array<any> = [];
  public thirst_level: Array<any> = [];
  public four_level: Array<any> = [];
  public five_level: Array<any> = [];
  public is_group_disabled: boolean;
  public is_row_disabled: boolean;
  public is_method_disabled: boolean;


  constructor(
    private http: _HttpClient,
    private gameService: GameService,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_play_type();
    // setInterval(()=>{
  
    // },3000)

  }
  /**
   * 彩种开关
   */
  change_lottory_status(type, item) {
    let option = {
      id: item.id,
      status: type?1:0
    }
    item.status=type?1:0;
    this.is_group_disabled=!this.is_group_disabled;
    this.gameService.lotteries_status(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('切换彩种开关成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 玩法组开关
   */
  change_play_status(type, item) {
    let option = {
      lottery_id: item.lottery_id,
      method_group: item.method_group,
      status: type?1:0
    }
    item.status=type?1:0;
    this.is_row_disabled=!this.is_row_disabled;

    this.gameService.group_status(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('切换玩法组开关成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
    /**
   * 玩法行开关
   */
  change_row_status(type, item) {
    let option = {
      lottery_id: item.lottery_id,
      method_group: item.method_group,
      method_row:item.method_row,
      status: type?1:0
    }
    item.status=type?1:0;
    this.is_method_disabled=!this.is_method_disabled;
   
    this.gameService.row_status(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('切换开关成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
    /**
   * 玩法开关
   */
  change_method_status(type, item) {
    let option = {
      id: item.id,
      status: type?1:0
    }
    item.status=type?1:0;
    this.gameService.method_status(option).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('切换玩法开关成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
   *获取玩法类型
   *
   * @memberof GameGamePlayComponent
   */
  get_play_type() {
    this.gameService.get_play_type().subscribe((res: any) => {
      if (res && res.success) {
        this.first_level = [];
        this.get_array_obj(res.data, this.first_level);
        this.show_child_city(this.first_level[0],1);
        this.show_child_city(this.second_level[0],2);
        this.show_child_city(this.thirst_level[0],3);
        this.show_child_city(this.four_level[0],4);
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *递归得到数组类型
   *
   * @memberof GameGamePlayComponent
   */
  get_array_obj(obj, array) {

    for (let key in obj) {
      let o;
      let item;
      if (obj[key].data) {
         o = obj[key].data
         o.key = key
         item = obj[key].child;
      } else {
         o = {
          key: key
        }
         item = obj[key];
      };
      if (item instanceof Object && !Array.isArray(item)) {
        o['child'] = [];
        this.get_array_obj(item, o['child']);
      } else if (item instanceof Array && Array.isArray(item)) {
        o['child'] = item, o['child'];
      }
      array.push(o);


    }
    console.log(array);
  }
  /**
     *玩法展开下级
     * @param {*} data
     * @memberof UserCityListComponent
     */
  show_child_city(data, num) {
    switch (num) {
      case 1:
        this.first_level.forEach((item) => {
          item.is_edit = false;
        });
        this.second_level = data.child;
        this.thirst_level = [];
        this.four_level = [];
        this.five_level = [];
        break;
      case 2:
        this.second_level.forEach((item) => {
          item.is_edit = false;
        });
        this.is_group_disabled=data.status==1?false:true;
        this.thirst_level = data.child;
        this.four_level = [];
        this.five_level = [];
        break;
      case 3:
          this.is_row_disabled=data.status==1?false:true;
        this.thirst_level.forEach((item) => {
          item.is_edit = false;
        });
        this.four_level = data.child;
        this.five_level = [];
        break;
      case 4:
          this.is_method_disabled=data.status==1?false:true;
        this.four_level.forEach((item) => {
          item.is_edit = false;
        });
        this.five_level = data.child;
        break;
        case 5:
  
          this.five_level.forEach((item) => {
            item.is_edit = false;
          });

          break;

    }
    data.is_edit = true;
  }



}
