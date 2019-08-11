import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { UserManageService } from 'app/service/user-manage.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-user-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.less']
})
export class UserCityListComponent implements OnInit {
  public first_level: Array<any> = [];
  public second_level: Array<any> = [];
  public thirst_level: Array<any> = [];
  public four_level: Array<any> = [];
  public parent_id_lv1: string;
  public parent_id_lv2: string;
  public parent_id_lv3: string;
  public parent_id_lv: string;
  //弹框
  public is_edit_city: boolean;
  public submit_passport_lodding: boolean;
  public is_edit_obj: object = {};
  public edit_type: number;
  public edit_type_string: string;

  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_city_first_list();
  }
  /**
   *提交修改城市名称
   *
   * @memberof UserCityListComponent
   */
  submit_edit() {
    var option={
      id:this.is_edit_obj['id'],
      region_id:this.is_edit_obj['region_id'],
      region_name:this.is_edit_obj['region_name'],
      region_level:this.is_edit_obj['region_level']
    }
    this.submit_passport_lodding=true;
    if (this.is_edit_obj['type'] == 'add') {

    }else if(this.is_edit_obj['type'] == 'edit'){
      this.userManageService.edit_city_msg(option).subscribe((res: any) => {
        this.submit_passport_lodding=false;
        this.is_edit_city=false;
        if (res && res.success) {
          this.message.success('修改成功', {
            nzDuration: 10000,
          });
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }

  }
  /**
   *
   *点击城市展开下级
   * @param {*} data
   * @memberof UserCityListComponent
   */
  show_child_city(data, num) {
    switch (num) {
      case 1:
        this.first_level.forEach((item) => {
          item.is_edit = false;
        });
        this.parent_id_lv1 = data.region_id;
        this.parent_id_lv2 = '';
        this.parent_id_lv3 = '';
        break;
      case 2:
        this.second_level.forEach((item) => {
          item.is_edit = false;
        });
        this.parent_id_lv2 = data.region_id;
        this.parent_id_lv3 = '';
        break;
      case 3:
        this.thirst_level.forEach((item) => {
          item.is_edit = false;
        });
        this.parent_id_lv3 = data.region_id;
        this.get_city_lastt_list(data.region_id);

        break;
      case 4:


        break;

    }
    data.is_edit = true;
  }
  /**
   *获取前面三级城市列表
   *
   * @memberof UserCityListComponent
   */
  get_city_first_list() {
    this.userManageService.get_city_list().subscribe((res: any) => {
      if (res && res.success) {
       if(res.data.length<=0) return;
        res.data.forEach((item) => {
          switch (item.region_level) {
            case 1:
              this.first_level.push(item);
              break;
            case 2:
              this.second_level.push(item);
              break;
            case 3:
              this.thirst_level.push(item);
              break;
          }
        });
        //默认选中第一个
        this.show_child_city(this.first_level[0],1);
        this.show_child_city(this.second_level[0],2);
        this.show_child_city(this.thirst_level[0],3);
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
 *获取前第四级城市列表
 *
 * @memberof UserCityListComponent
 */
  get_city_lastt_list(id) {
    let option = {
      region_parent_id: id,
      region_level: 3,
    }
    this.four_level=[];
    this.userManageService.get_city_last_list(option).subscribe((res: any) => {
      if (res && res.success) {
        res.data.forEach((item) => {
          this.four_level.push(item);

        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *编辑
   *
   * @param {*} data
   * @memberof UserCityListComponent
   */
  edit_city(data, type, e) {
    e.stopPropagation();
    switch (type) {
      case 1:
        this.edit_type_string = '省/直辖市'
        break;
      case 2:
        this.edit_type_string = '市'
        break;
      case 3:
        this.edit_type_string = '区/县'
        break;
      case 4:
        this.edit_type_string = '镇/营业厅'
        break;
    }
    this.is_edit_obj = JSON.parse(JSON.stringify(data));
    this.is_edit_obj = JSON.parse(JSON.stringify(data));
    this.is_edit_obj['type'] = 'edit';
    this.edit_type = type;
    this.is_edit_city = true;
  }


}
