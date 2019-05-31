import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { settings } from 'cluster';
import { DeveloperService } from 'app/service/developer.service';

@Component({
  selector: 'app-developer-play-level',
  templateUrl: './play-level.component.html',
  styleUrls: ['./play-level.component.less']
})
export class DeveloperPlayLevelComponent implements OnInit {

  public page_index = 1;
  public list_of_data: Array<any> = [];
  public listOfDisplayData: Array<any> = [];
  public list_total: number;
  public searchValue: string;
  public is_load_list: boolean;
  //-------------弹框参数
  public if_show_modal: boolean;
  public is_load_list_child: boolean;
  public is_add_child: boolean;

  
  public modal_type: string = 'create';
  public create_form: FormGroup;//表单对象
  public modal_lodding: boolean;//显示加载图标
  public edit_level_obj: object = {

  }



  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private developerService: DeveloperService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.create_form = this.fb.group({
      method_id: [null, [Validators.required]],
      level: [null, [Validators.required]],
      position: [null, [Validators.required]],
      count: [null, [Validators.required]],
      prize: [null, [Validators.required]],
    });
    this.get_play_level_list();

  }
  /**
   * 取消搜索
   */
  reset(){

  }
  search(): void {
    const filterFunc = (item: { method_id: string }) => {
      return ( item.method_id.indexOf(this.searchValue) !== -1);
    };
    const data = this.list_of_data.filter((item: { method_id: string }) => filterFunc(item));
    this.listOfDisplayData = data;
  }
    /**
   *初始化表单
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  update_form() {
    this.modal_lodding = false;
    this.edit_level_obj={};
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }
  /**
   * 关闭弹框
   */
  close_modal(){
    this.if_show_modal = false;
    this.update_form();
  }

  /**
   * 点击添加
   */
  public add_play_level(data?) {
    this.if_show_modal = true;
    this.is_add_child = false;
    this.modal_type = 'create';
    this.edit_level_obj['level']=5;
    if(data){
      this.is_add_child = true;
      this.edit_level_obj['method_id']=data.method_id;
    }
  }
    /**
 * 点击编辑
 */
public edit_paly(data) {
  this.modal_type = 'edit';
  this.if_show_modal = true;
  this.is_add_child = true;
  this.edit_level_obj={
    id:data.id,
    method_id:data.method_id,
    level:data.level,
    position:data.position,
    count:data.count,
    prize:data.prize
  }
}
  /**
   * 点击提交
   */
  public submit_paly_level() {

    if(this.is_add_child){
      this.is_load_list_child = true;
    }else{
      this.modal_lodding = true;
    }
    let option = {
      method_id: this.edit_level_obj['method_id'],
      level: this.edit_level_obj['level'],
      id: this.edit_level_obj['id'],
      position: this.edit_level_obj['position'],
      count: this.edit_level_obj['count'],
      prize: this.edit_level_obj['prize'],
    };
    if (this.modal_type == 'create') {
      this.add_paly_level(option);
    } else if (this.modal_type == 'edit') {
      this.edit_paly_level(option);
    }
  }
    /**
   * 提交添加
   * @param data 
   */
  public add_paly_level(data) {
    this.developerService.add_game_level(data).subscribe((res: any) => {
      if(this.is_add_child){
        this.is_load_list_child = false;
      }else{
        this.modal_lodding = false;
      }
      if (res && res.success) {
        this.get_play_level_list();
        this.message.success('添加玩法中奖等级成功', {
          nzDuration: 10000,
        });
        this.if_show_modal = false;
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 提交修改
   * @param data 
   */
  public edit_paly_level(data) {
    this.developerService.edit_game_level(data).subscribe((res: any) => {
      if(this.is_add_child){
        this.is_load_list_child = false;
      }else{
        this.modal_lodding = false;
      }
      if (res && res.success) {
        this.get_play_level_list();
        this.message.success('添加玩法中奖等级成功', {
          nzDuration: 10000,
        });
        this.if_show_modal = false;
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
 * 点击删除
 */
  public delete_paly_level(data) {
    let option={
      id:data.id
    }
    this.developerService.delete_game_level(option).subscribe((res: any) => {
      if (res && res.success) {
        this.get_play_level_list();
        this.message.success('删除玩法中奖等级成功', {
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
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  public chang_page_index(item) {
    // this.get_system_setting_list();
  }
  /*
*s
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  public get_play_level_list() {
    this.is_load_list = true;
    this.developerService.get_game_level().subscribe((res: any) => {
      if (res && res.success) {
    
        this.is_load_list = false;
        this.list_of_data = [];

        for(let key in res.data){
          this.list_of_data.push(
            {
              method_id:key,
              child:res.data[key]
            }
          )
        }
       
        this.listOfDisplayData = [...this.list_of_data];

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }


}
