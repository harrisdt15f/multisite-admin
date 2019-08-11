import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { settings } from 'cluster';
@Component({
  selector: 'app-operasyon-activity-type',
  templateUrl: './activity-type.component.html',
  styleUrls: ['./activity-type.component.less']
})
export class OperasyonActivityTypeComponent implements OnInit {

  public page_index = 1;
  public list_of_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;
  //弹框
  public l_size: string;
  public w_size: string;
  public size: string;
  @ViewChild('myInput') input;


  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_system_setting_list();

  }
  /**
   *提交修改
   *
   * @memberof OperasyonActivityTypeComponent
   */
  submit_activity() {

  }

  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    // this.get_system_setting_list();
  }
  /**
   *编辑活动类型
   *
   * @memberof OperasyonActivityTypeComponent
   */
  edit_activity_type(e,item, type) {
    e.stopPropagation();
    this.refresh_input();

    switch (type) {
      case 'l_size':
        this.l_size = item.l_size;
        item.is_edit_l_size = true;
        item.is_loading_l_size = false;
        break;
      case 'w_size':
        this.w_size = item.w_size;
        item.is_edit_w_size = true;
        item.is_loading_w_size = false;
        break;
      case 'size':
        this.size = item.wize;
        item.is_edit_size = true;
        item.is_loading_size = false;
        break;

    }
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100);
  }
  /**
   *宽度失去焦点
   *
   * @param {*} item
   * @memberof OperasyonActivityTypeComponent
   */
  blur_l_size(item) {

  }
  /**
   *修改状态
   *
   * @param {*} data
   * @memberof OperasyonActivityTypeComponent
   */
  edit_status(e,data) {
    var option = {
      status: 1,
    };
    this.update_activity_type(option, data);
  }
  /**
   *确认修改最大宽度
   *
   * @memberof OperasyonActivityTypeComponent
   */
  edit_l_size(e,data) {
    e.stopPropagation();
    data.is_loading_l_size=true;
    var option = {
      status: 1,
      l_size: this.l_size,
      w_size: 1080,
      size: 2000
    };
    this.update_activity_type(option, data);
  }
  /**
  *确认修改最大高度
  *
  * @memberof OperasyonActivityTypeComponent
  */
  edit_w_size(e,data) {
    e.stopPropagation();
    data.is_loading_w_size=true;
    var option = {
      status: 1,
      l_size: 22,
      w_size: this.w_size,
      size: 2000
    };
    this.update_activity_type(option, data);
  }
  /**
  *确认修改最大尺寸
  *
  * @memberof OperasyonActivityTypeComponent
  */
  edit_size(e,data) {
    e.stopPropagation();
    data.is_loading_size=true;
    var option = {
      status: 1,
      l_size: 222,
      w_size: 1080,
      size: this.size
    };
    this.update_activity_type(option, data);
  }
  /**
   *
   *调用修改
   * @memberof OperasyonActivityTypeComponent
   */
  update_activity_type(option, data) {
    option.id = data.id;
    this.userManageService.edit_activity_type(option).subscribe((res: any) => {
      data.is_edit_l_size = false;
      if (res && res.success) {
        this.refresh_input();
        this.get_system_setting_list();

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *点击外框
   *
   * @memberof OperasyonActivityTypeComponent
   */
  click_body() {
    this.refresh_input();
  }
  /**
   *关闭界面所有弹框
   *
   * @memberof OperasyonActivityTypeComponent
   */
  refresh_input() {
    this.list_of_data.forEach((item) => {
      item.is_edit_l_size = false;
      item.is_edit_w_size = false;
      item.is_edit_size = false;
      item.is_loading_l_size=true;
      item.is_loading_w_size=true;
      item.is_loading_size=true;
    });
    this.l_size = '';
    this.w_size = '';
    this.size = '';

  }
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_system_setting_list() {
    this.is_load_list = true;
    this.userManageService.get_activity_type_list().subscribe((res: any) => {
      if (res && res.success) {
        this.is_load_list = false;
        this.list_of_data = res.data;

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }


}

