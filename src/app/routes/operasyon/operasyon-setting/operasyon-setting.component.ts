import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { settings } from 'cluster';
@Component({
  selector: 'app-operasyon-operasyon-setting',
  templateUrl: './operasyon-setting.component.html',
  styleUrls: ['./operasyon-setting.component.less']
})
export class OperasyonOperasyonSettingComponent implements OnInit {

  public page_index = 1;
  public list_of_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;

  //创建设置参数
  public if_create_setting: boolean;
  public is_parent: boolean;
  public create_form: FormGroup;
  public parent_id: number;
  public modal_lodding: boolean;
  public is_load_list_child: boolean;
  public modal_type: string = 'create';//弹框类型创建还是修改
  public setting_obj: object = {};

  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_system_setting_list();
    this.create_form = this.fb.group({
      name: [null, [Validators.required,Validators.maxLength(32),Validators.minLength(2)]],
      sign: [null,[this.confirmValidator,Validators.maxLength(32),Validators.minLength(2)]],
      description: [null, [Validators.required]],
      value: [null, [this.confirmationValidator]],

    });
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value && !this.is_parent) {
      return { required: true };
    }
    return {};
  };
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(control.value)||/[0-9]/.test(control.value)) {
      return { sign: true, error: true };
    }
    return {};
  };
  /**
   *创建子设置
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  edit_setting(item, type) {
    if (type === 'parent') {
      this.is_parent = true;
    } else {
      this.is_parent = false;
    }
    this.remove_setting_modal();


    this.setting_obj = JSON.parse(JSON.stringify(item));
    this.if_create_setting = true;
    this.modal_type = 'edit';
    this.parent_id = item.parent_id;

  }
  /**
   *点击创建设置
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  create_setting(type, parent_id?) {
    if (type === 'parent') {
      this.parent_id = 0;
      this.is_parent = true;
    } else if (parent_id) {
      this.parent_id = parent_id;
      this.is_parent = false;
    }
    this.remove_setting_modal();


    this.if_create_setting = true;
    this.modal_type = 'create';
  }
  /**
   *
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  submit_settings() {
    let option = {
      parent_id: this.parent_id,
      sign: this.setting_obj['sign'],
      name: this.setting_obj['name'],
      description: this.setting_obj['description'],

    };
    if(this.parent_id!=0){
      option['value']=this.setting_obj['value']
    }
    this.modal_lodding = true;
    switch (this.modal_type) {
      case 'create':
        this.create_setting_obj(option);
        break;
      case 'edit':
        option['id'] = this.setting_obj['id'];
        this.edit_setting_obj(option);
        break;
    }
  }
  /**
   *提交创建的设置
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  create_setting_obj(option) {

    this.userManageService.create_system_setting_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.remove_setting_modal();
        this.get_system_setting_list();
        this.message.success('创建系统设置成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        this.modal_lodding = false;
      }
    })
  }


  /**
   *提交修改的设置
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  edit_setting_obj(option) {
    this.userManageService.edit_system_setting_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.remove_setting_modal();
        this.get_system_setting_list();
        this.message.success('修改系统设置成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        this.modal_lodding = false;
      }
    })
  }



  /**
   *初始化添加设置弹框
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  remove_setting_modal() {
    this.if_create_setting = false;
    this.setting_obj = {};
    this.modal_lodding = false;
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
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
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_system_setting_list() {
    this.is_load_list = true;
    this.userManageService.get_system_setting_list().subscribe((res: any) => {
      if (res && res.success) {
        this.is_load_list = false;
        this.list_of_data = [];
       for(let x in res.data) {
        this.list_of_data.push(res.data[x]);
       }
      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *切换开关按钮
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  change_status(data) {
    let option = {
      id: data.id,
      status: data.status===1?0:1,
      parent_id: data.parent_id
    };
    this.is_load_list_child = true;
    setTimeout(()=>{
      this.is_load_list_child = false;
    },5000)
    this.userManageService.change_status(option).subscribe((res: any) => {
      this.is_load_list_child = false;
      if (res && res.success) {
        this.message.success('修改启用状态成功', {
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
   *删除配置
   *
   * @memberof OperasyonOperasyonSettingComponent
   */
  delete_setting(item) {
    let option = {
      id: item.id
    };
    this.is_load_list_child = true;
    this.userManageService.delete_system_setting_list(option).subscribe((res: any) => {
      this.is_load_list_child = false;
      this.get_system_setting_list()
      if (res && res.success) {
        this.message.success('删除成功', {
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

