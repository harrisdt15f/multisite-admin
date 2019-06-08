import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { settings } from 'cluster';
import { AdService } from 'app/service/ad.service';
import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-ad-ad-type',
  templateUrl: './ad-type.component.html',
})
export class AdAdTypeComponent implements OnInit {
  public page_index = 1;
  public list_of_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;
  //弹框
  public l_size: number;
  public w_size: number;
  public size: number;
  @ViewChild('myInput') input;


  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private adService: AdService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_system_setting_list();

  }
  /**
   *提交修改
   *
   * @memberof OperasyonadTypeComponent
   */
  submit_ad() {

  }
    /**
 * 金额输入框验证
 */
account_check(type) {

  this[type] = Utils.account_check(this[type]);
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
   * @memberof OperasyonadTypeComponent
   */
  edit_ad_type(e,item, type) {
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
   * @memberof OperasyonadTypeComponent
   */
  blur_l_size(item) {

  }
  /**
   *修改状态
   *
   * @param {*} data
   * @memberof OperasyonadTypeComponent
   */
  edit_status(e,data) {
    var option = {
      status: e?1:0,
    };
    this.update_ad_type(option, data,()=>{
      
    });
  }
  /**
   *确认修改最大宽度
   *
   * @memberof OperasyonadTypeComponent
   */
  edit_l_size(e,data) {
    e.stopPropagation();
    data.is_loading_l_size=true;
    var option = {
      l_size: this.l_size,
    };
    this.update_ad_type(option, data,()=>{
      data.l_size=this.l_size;
      this.l_size=null;
    });
  }
  /**
  *确认修改最大高度
  *
  * @memberof OperasyonadTypeComponent
  */
  edit_w_size(e,data) {
    e.stopPropagation();
    data.is_loading_w_size=true;
    var option = {
      w_size: this.w_size,
    };
    this.update_ad_type(option, data,()=>{
      data.w_size=this.w_size;
      this.w_size=null;
    });
  }
  /**
  *确认修改最大尺寸
  *
  * @memberof OperasyonadTypeComponent
  */
  edit_size(e,data) {
    e.stopPropagation();
    data.is_loading_size=true;
    var option = {
      size:this.size
    };

    this.update_ad_type(option, data,()=>{
      data.size=this.size;
      this.size=null;
    });
  }
  /**
   *
   *调用修改
   * @memberof OperasyonadTypeComponent
   */
  update_ad_type(option, data,callback) {
    option.id = data.id;
    this.adService.edit_ad_type(option).subscribe((res: any) => {
      data.is_edit_l_size = false;
      if (res && res.success) {
        this.refresh_input();
        callback();
        // this.get_system_setting_list();

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
  /**
   *点击外框
   *
   * @memberof OperasyonadTypeComponent
   */
  click_body() {
    this.refresh_input();
  }

  
  /**
   *关闭界面所有弹框
   *
   * @memberof OperasyonadTypeComponent
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
  }
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_system_setting_list() {
    this.is_load_list = true;
    this.adService.get_ad_type_list().subscribe((res: any) => {
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
