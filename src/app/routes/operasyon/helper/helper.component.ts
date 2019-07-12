import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PersonalService } from 'app/service/personal.service';
import { Utils } from 'config/utils.config';
declare let window: any;
@Component({
  selector: 'app-operasyon-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.less']
})
export class OperasyonHelperComponent implements OnInit {

  public page_index = 1;
  public list_of_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;

  //创建帮助菜单参数
  public if_create_helper: boolean;
  public is_parent: boolean;
  public create_form: FormGroup;
  public pid: number;
  public modal_lodding: boolean;
  public is_load_list_child: boolean;
  public modal_type: string = 'create';//弹框类型创建还是修改
  public helper_obj: object = {};

  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private personalService: PersonalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_system_helper_list();
    this.create_form = this.fb.group({
      menu: [null, [Validators.required, Validators.maxLength(32), Validators.minLength(2)]],
      content: [null, [this.confirmationValidator]],
      status: [null, [Validators.required]],

    });
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value && !this.is_parent) {
      return { required: true };
    }
    return {};
  };

  /**
   *编辑菜单
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  edit_helper(item, type) {
    window.upload_iri = Utils.get_upload_iri('help');
    this.helper_obj = JSON.parse(JSON.stringify(item));
    if (type === 'parent') {
      this.is_parent = true;
    } else {
      this.is_parent = false;
      if (this.helper_obj['content']) {
        this.helper_obj['content'] = Utils.get_img_iri(this.helper_obj['content'], 'add').content
      }
    }
    this.helper_obj['status'] = JSON.stringify(this.helper_obj['status']);
    this.if_create_helper = true;
    this.modal_type = 'edit';
    this.pid = item.pid;
  }
  /**
   *点击创建帮助菜单
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  create_helper(type, pid?) {
    window.upload_iri = Utils.get_upload_iri('help');

    if (type === 'parent') {
      this.pid = 0;
      this.is_parent = true;
    } else if (pid) {
      this.pid = pid;
      this.is_parent = false;
    }
    this.remove_helper_modal();


    this.if_create_helper = true;
    this.modal_type = 'create';
  }
  /**
   *
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  submit_helpers() {
    let option = {
      pid: this.pid,
      menu: this.helper_obj['menu'],
      status: this.helper_obj['status']
    };
    if (!this.is_parent&&option['content']) {
      let img_obj = Utils.get_img_iri(this.helper_obj['content'], 'remove');
      option['content'] = img_obj.content;
    }
    this.modal_lodding = true;
    switch (this.modal_type) {
      case 'create':
        this.create_helper_obj(option);
        break;
      case 'edit':
        option['id'] = this.helper_obj['id'];
        this.edit_helper_obj(option);
        break;
    }
  }
  /**
   *提交创建的帮助菜单
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  create_helper_obj(option) {

    this.personalService.create_system_helper_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.remove_helper_modal();
        this.get_system_helper_list();
        this.message.success('创建帮助菜单成功', {
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
   *提交修改的帮助菜单
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  edit_helper_obj(option) {
    this.personalService.edit_system_helper_list(option).subscribe((res: any) => {
      if (res && res.success) {
        this.remove_helper_modal();
        this.get_system_helper_list();
        this.message.success('修改帮助菜单成功', {
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
   *初始化添加帮助菜单弹框
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  remove_helper_modal() {
    this.if_create_helper = false;
    this.helper_obj = {};
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
    // this.get_system_helper_list();
  }
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_system_helper_list() {
    this.is_load_list = true;
    this.personalService.get_system_helper_list().subscribe((res: any) => {
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
  /**
   *切换开关按钮
   *
   * @memberof OperasyonOperasyonhelperComponent
   */
  change_status(data) {
    let option = {
      id: data.id,
      menu: data.menu,
      status: data.status == 1 ? 0 : 1,
      pid: data.pid
    };
    if (data.content) {
      option['content'] = data.content;
    }
    this.is_load_list_child = true;
    setTimeout(() => {
      this.is_load_list_child = false;
    }, 5000)
    this.personalService.edit_system_helper_list(option).subscribe((res: any) => {
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
   * @memberof OperasyonOperasyonhelperComponent
   */
  delete_helper(item) {
    let option = {
      id: item.id
    };
    this.is_load_list_child = true;
    this.personalService.delete_system_helper_list(option).subscribe((res: any) => {
      this.is_load_list_child = false;
      this.get_system_helper_list()
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

  _ready(e) { }
  _destroy() { }
  _change(e) { }

}

