import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { StartupService } from '@core/startup/startup.service';
import { ManagerService } from 'app/service/manager.service';
import { Injectable, Injector } from '@angular/core';
import { NzMessageService, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { AUTO_STYLE } from '@angular/animations';
import { Utils } from 'config/utils.config';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  ValidationErrors,
} from '@angular/forms';
import { Observer, Observable } from 'rxjs';
/**
 *
 * @export
 * @class ManagerManagerCharacterComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-manager-manager-character',
  templateUrl: './manager-character.component.html',
  styleUrls: ['./manager-character.less'],
})
export class ManagerManagerCharacterComponent implements OnInit {
  public groupForm: FormGroup;
  public passwordVisible = false;
  public managerCreateForm: FormGroup;
  public change_group: FormGroup;
  public change_passports: FormGroup;
  public page_size = 9; //分页的每页条数
  //组--------------------
  public edit_group_obj: object = {
    edit_group_obj: [],
  }; // 当前编辑的组对象
  public menu_tree_value: string[] = []; // 选择菜单input值
  public menu_nodes = []; // 菜单数组
  public group_list: Array<any> = []; // 显示的组列表
  public group_list_total: Array<any> = []; // 组列表总数
  public is_edit_group = false; // 创建/编辑组
  // public show_type: string;
  public is_super_manage: boolean; // 是否超级管理员组
  public is_loading_group = false; // 加载图标
  public group_page_index: number = 1; // 组列表当前页
  public is_up_member: boolean; // 团队中成员列表加载按钮是否显示
  public select_style = {
    'max-height': '400px',
    overflow: 'auto',
  };
  //-----------弹框
  public group_modal_lodding: boolean;
  public is_loading_delete: boolean;
  public modal_lodding: boolean;
  public is_visible_delete_modal: boolean;
  public move_group_name: string;
  public delet_group: object = {};
  //管理员-------------------------
  public is_edit_manager = false; //创建/编辑组
  public create_manager_obj: object = new create_manager_obj(); //创建的菜单对象
  public manager_page_index: number = 1; //加载图标
  public is_edit_manage_modal: boolean;
  // 搜索的用户
  public searchUser = {
    is_losding: false,
    show: false,
    search_name: '',
    data: []
  };
  constructor(
    private http: _HttpClient,
    private startupService: StartupService,
    private managerService: ManagerService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private injector: Injector,
    private fb: FormBuilder,
  ) { }
  onChange($event: string[]): void {
    console.log($event);
  }

  ngOnInit() {
    setTimeout(() => {
      this.menu_nodes = this.startupService.menu_list;
    }, 3000);
    // 获取组
    this.get_group();
    // 创建，修改组验证
    this.groupForm = this.fb.group({
      group_name: [null, [Validators.required]],
      menu: [null, [Validators.required]],
    });
    // 创建管理员验证
    this.managerCreateForm = this.fb.group({
      manager_name: [null, [Validators.required, Validators.pattern(Utils.RegExString.reg_ex_2)]],
      manager_group: [null, [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(Utils.RegExString.reg_ex_2)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
    // 换分组
    this.change_group = this.fb.group({
      group_id: [null, [Validators.required]],
    });
    // 换密码
    this.change_passports = this.fb.group({
      passport: [null, [Validators.required]],
    });
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.managerCreateForm.controls.checkPassword.updateValueAndValidity(),
    );
  }
  userNameAsyncValidator = (control: FormControl) =>
    Observable.create((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  resetForm(form): void {
    form.reset();
    for (const key in form.controls) {
      form.controls[key].markAsPristine();
      form.controls[key].updateValueAndValidity();
    }
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !== this.managerCreateForm.controls.password.value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  };
  /**
   * 搜索用户
   */
  searchManage() {
    this.searchUser.is_losding = true;
    let option = {
      email: this.searchUser.search_name
    };
    this.managerService.search_user(option).subscribe((res: any) => {
      this.searchUser.is_losding = false;
      if (res && res.success) {
        const userResult = res.data.data;
        if (userResult.length === 0) {
          this.modalService.info({
            nzTitle: '温馨提示！',
            nzContent: '查无此管理员'
          });
        } else if (userResult.length === 1) {
          const user = userResult[0];
          this.jumpGroup(user);
        } else if (userResult.length > 1) {
          this.searchUser.show = true;
          this.searchUser.data = userResult;
        }
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }
  /**
   * 跳转组对应的用户
   */
  jumpGroup(user) {
    this.searchUser.show = false;
    this.group_list.forEach((item) => {
      if (item.id === user.group_id) {
        this.edit_group(item, user.id);
      }
    });
  }

  /**
   * 点击添加组按钮
   * @memberof ManagerManagerCharacterComponent
   */
  add_group() {

    this.resetForm(this.groupForm);
    this.is_edit_group = false;
    this.is_super_manage = false;
    this.menu_tree_value = [];
    // this.show_type = "edit";
    this.edit_group_obj = {
      edit_group_obj: [],
    };
  }
  /**
   *创建组
   *
   */
  create_group() {

    var optoion = {
      group_name: this.edit_group_obj['group_name'],
      role: JSON.stringify(this.get_group_role()),
    };
    this.group_modal_lodding = true;
    setTimeout(() => {
      this.group_modal_lodding = false;
    }, 5000)
    this.managerService.create_manager_group(optoion).subscribe((res: any) => {
      this.group_modal_lodding = false;
      if (res && res.success) {
        this.resetForm(this.groupForm);
        this.remove_edit_group();
        //获取组
        this.get_group();
        this.message.success('创建组成功', {
          nzDuration: 3000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }


  /**
   * 处理菜单数组
   *
   */
  get_group_role() {
    let role = [];
    let menu_obj = this.startupService.menu_obj;
    this.menu_tree_value.forEach(item => {
      role.push(item);
      if (menu_obj[item]) {
        //有父级加入父级
        if (menu_obj[item].pid && menu_obj[item].pid != 0) {
          role.push(Number(menu_obj[item].pid));
        }
        //如果是父级元素，则把子全都加入
        // tslint:disable-next-line: forin
        for (let key in menu_obj[item].child) {
          role.push(Number(key));
          if (menu_obj[item].child[key].child) {
            // tslint:disable-next-line: forin
            for (let x in menu_obj[item].child[key].child) {
              role.push(Number(x));
            }
          }
        }
      }
    });
    return Array.from(new Set(role));
  }

  /**
   *获取组
   *
   */
  get_group() {
    this.is_loading_group = true;
    this.managerService.get_manager_group().subscribe((res: any) => {
      if (res && res.success) {
        this.is_loading_group = false;
        this.group_list_total = res.data;
        this.group_page_index = 1;
        //显示第一页
        this.group_list = this.get_now_page_data(res.data, 1, this.page_size);
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }
  /**
   *点击编辑组
   *
   * @param {*} item
   * @memberof ManagerManagerCharacterComponent
   */
  edit_group(item, userId?) {
    this.group_list.forEach((data, index) => {
      data.is_edit = false;
    });
    item.is_edit = true;
    this.is_edit_group = true;
    this.edit_group_obj = item;
    this.get_member_list(item, userId);
    if (item.role != '*') {
      this.is_super_manage = false;
      this.menu_tree_value = [];
      JSON.parse(item.role).forEach((item) => {
        if ((this.startupService.menu_obj[item]) && (!this.startupService.menu_obj[item].is_parent)) {
          this.menu_tree_value.push(item);
        }
      });

    } else {
      this.is_super_manage = true;
      this.menu_tree_value = [];
    }

  }

  /**
   *获取组下成员列表
   *
   * @memberof ManagerManagerCharacterComponent
   */
  get_member_list(item, userId?) {
    this.edit_group_obj['member_list'] = [];
    let option = {
      id: item.id,
    };
    this.is_up_member = true;
    this.managerService.get_member_list(option).subscribe((res: any) => {
      if (res && res.success) {
        item.member_list = res.data;
        if (userId) {
          item.member_list.forEach((item) => {
            if (item.id === userId) {
              this.edit_manager(item);
            }
          });
        }
        this.is_up_member = false;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }

  /**
   *点击取消编辑组
   *
   * @memberof ManagerManagerCharacterComponent
   */
  remove_edit_group() {
    this.group_list.forEach((data, index) => {
      data.is_edit = false;
    });
    this.is_edit_group = false;
    this.edit_group_obj = {
      edit_group_obj: [],
    };
    this.menu_tree_value = [];
  }
  /**
   *点击删除组
   *
   * @param {*} item
   * @memberof ManagerManagerCharacterComponent
   */
  delete_group(item, i) {
    this.is_visible_delete_modal = true;
    this.delet_group = item;

  }
  delete_group_submit_cancel() {
    this.is_visible_delete_modal = false;
  }

  delete_group_submit() {
    let option = {
      id: this.delet_group['id'],
      group_name: this.delet_group['group_name']
    };
    this.is_loading_delete = true;
    setTimeout(() => {
      this.is_loading_delete = false;
    }, 5000);
    this.managerService.delete_group(option).subscribe((res: any) => {
      this.is_loading_delete = false;
      if (res && res.success) {
        this.remove_edit_group();
        this.is_visible_delete_modal = false;
        //获取组
        this.get_group();

        this.message.success('删除组成功', {
          nzDuration: 3000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }
  /**
   *点击修改组
   *
   * @memberof ManagerManagerCharacterComponent
   */
  update_group() {
    let option = {
      id: this.edit_group_obj['id'],
      group_name: this.edit_group_obj['group_name'],
      role: JSON.stringify(this.get_group_role()),
    };
    this.group_modal_lodding = true;
    setTimeout(() => {
      this.group_modal_lodding = false;
    }, 5000)
    this.managerService.edit_manager_group(option).subscribe((res: any) => {
      this.group_modal_lodding = false;
      if (res && res.success) {
        this.remove_edit_group();
        this.resetForm(this.groupForm);
        //获取组
        this.get_group();
        this.message.success('修改组成功', {
          nzDuration: 3000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }

  /**
   *点击取消编辑管理员
   *
   * @memberof ManagerManagerCharacterComponent
   */
  remove_edit_mnager() {
    this.is_edit_manage_modal = false;
    this.create_manager_obj = new create_manager_obj();
  }
  /**
   *分页列表，得到当前页面数据
   *
   * @param {*} list 总数组
   * @param {*} page 要获取的页数
   * @param {*} num  每一页显示条数
   * @memberof ManagerManagerCharacterComponent
   */
  get_now_page_data(list, page, num) {
    let array = list.filter((item, index) => {
      return index >= (page - 1) * num && index < page * num;
    });
    return array;
  }
  /**
   *组修改页数的回调
   *
   * @param {*} index
   * @memberof ManagerManagerCharacterComponent
   */
  change_page(index) {
    this.group_list = this.get_now_page_data(
      this.group_list_total,
      index,
      this.page_size,
    );
  }


  /**
   *点击删除管理员
   *
   * @param {*} item
   * @memberof ManagerManagerCharacterComponent
   */
  delete_manager(item, i) {
    let option = {
      id: item.id,
      name: item.name,
    };
    this.modal_lodding = true;
    setTimeout(() => {
      this.modal_lodding = false;
    }, 5000)
    this.managerService.delete_manager(option).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.remove_edit_mnager();
        //获取组
        this.get_member_list(this.edit_group_obj);
        this.message.success('删除管理员成功', {
          nzDuration: 3000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }

  /**
 *点击添加管理员按钮
 *
 * @memberof ManagerManagerCharacterComponent
 */
  add_mnager(id) {

    this.modal_lodding = false;
    this.is_edit_manager = false;
    this.is_edit_manage_modal = true;
    this.create_manager_obj = new create_manager_obj(id);
  }
  /**
   *点击修改管理员
   *
   * @memberof ManagerManagerCharacterComponent
   */
  edit_manager(item) {

    this.is_edit_manager = true;
    this.modal_lodding = false;
    this.is_edit_manage_modal = true;
    this.create_manager_obj = item;
  }
  /**
   *创建管理员
   *
   * @memberof ManagerManagerCharacterComponent
   */
  public create_manager() {
    let obj = this.create_manager_obj;
    let option = {
      name: obj['name'],
      email: obj['email'],
      password: obj['password'],
      is_test: 1,
      group_id: obj['group_id'],
    };
    this.modal_lodding = true;
    this.modal_lodding = true;
    setTimeout(() => {
      // this.manage_modal_lodding = false;
    }, 5000)
    this.managerService.create_manager(option).subscribe(res => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.remove_edit_mnager();

        this.get_member_list(this.edit_group_obj);
        this.resetForm(this.managerCreateForm);
        this.message.success('创建管理员成功', {
          nzDuration: 3000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }
  /**
   *点击修改管理员密码
   *
   * @memberof ManagerManagerCharacterComponent
   */
  change_passport() {
    let obj = this.create_manager_obj;
    if (!obj['new_password'] || obj['new_password'] == '') {
      this.message.error('新密码不能为空', {
        nzDuration: 10000,
      });
      return;
    }
    let option = {
      id: obj['id'],
      name: obj['name'],
      password: obj['new_password'],
    };
    this.modal_lodding = true;
    setTimeout(() => {
      this.modal_lodding = false;
    }, 5000)
    this.managerService.change_manager_passport(option).subscribe(res => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.remove_edit_mnager();

        this.resetForm(this.change_passports);
        this.message.success('修改管理员密码成功', {
          nzDuration: 3000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }

  isEmail(str_data) {
    str_data = str_data || String(this);
    return /^([a-zA-Z0-9_-]{1,16})@([a-zA-Z0-9]{1,9})(\.[a-zA-Z0-9]{1,9}){0,3}(\.(?:com|net|org|edu|gov|mil|cn|us)){1,4}$/.test(
      str_data,
    );
  }
  /**
   * 管理员选择分组
   * @param e 
   */
  change_group_select(e) {
    this.group_list.forEach((item) => {
      if (item.id == e) {
        this.move_group_name = item.group_name;
      }
    })

  }

  /**
   *修改管理员分组
   *
   * @memberof ManagerManagerCharacterComponent
   */
  update_manager() {
    let obj = this.create_manager_obj;
    let option = {
      id: obj['id'],
      group_id: obj['group_id'],
    };
    this.modal_lodding = true;

    this.managerService.edit_manager(option).subscribe(res => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.remove_edit_mnager();
        this.resetForm(this.change_group);
        this.get_member_list(this.edit_group_obj);

        // this.message.success('修改成功！该管理员已挪至'+this.move_group_name, {
        //   nzDuration: 3000,
        // });
        this.injector.get(NzNotificationService).success(
          '修改管理员分组成功！',
          '该管理员已挪至分组"' + this.move_group_name + '"',
        );
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
        return;
      }
    });
  }
}
class create_manager_obj {
  public name: string;
  public email: string;
  public password: string;
  public c_password: string;
  public group_id: number;
  constructor(id?: number) {
    this.group_id = id;
  }
}
