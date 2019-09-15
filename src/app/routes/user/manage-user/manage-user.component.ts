import { Component, OnInit, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { startOfMonth } from 'date-fns';
import { UserManageService } from 'app/service/user-manage.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BetInfoService } from 'app/provider/bet-info/bet-info.service';
import { Utils } from 'config/utils.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['manege-user.component.less']
})
export class UserManageUserComponent implements OnInit {

  // 搜索对象
  public searchData = {
    pageIndex: 1,
    pageSize: 15,
    id: '',
    is_tester: '',
    parent_name: '',
    type: '',
    username: '',
    parent_id: ''
  };
  public edit_change_passport_obj: object = {};//点击的用户对象
  public now_date = [new Date(), new Date()];
  public ranges1 = {
    "今日": [new Date(), new Date()],
    '本月': [startOfMonth(new Date()), new Date()]
  };
  public sortName: string | null = null;
  public sortValue: string | null = null;
  public mapOfExpandData: { [key: string]: boolean } = {};
  public change_passport_obj: object = {};

  public listOfDisplayData = [];
  public history_list = [];//权限操作历史列表
  public page_index = 1;
  public list_total: number;
  public is_load_list = false;
  public modal_type: string;
  public start_time: string;
  public end_time: string;
  public amount_type: string;//充值还是扣减
  public change_passport_apply: FormGroup;//提交申请修改密码表单
  //--------------弹框
  public look_history: boolean;//显示修改密码申请弹框
  public is_edit_change_passport: boolean;//显示权限操作历史
  public is_edit_permission: boolean;//显示权限操作历史

  //-------------操作历史参数
  public spin_show: boolean;
  public drawer_type: string;
  public edit_modal_o: object = {};
  public drawer_title = {
    account: '账变记录历史',
    recharge: '充值记录历史',
    permission: '权限冻结历史'
  };
  public create_form: FormGroup;//表单对象
  //---------------冻结权限功能参数
  public permission_type: string;
  public modal_lodding: boolean;
  public freeze_obj: object = {};
  public withdraw_obj: object = {};

  public freeze_form: FormGroup;
  //----------充值弹框
  public is_show_recharge_num: boolean;
  public now_edit_manage: object = {};
  public isOkLoading: boolean;
  public recharge_num: number;
  public apply_note: string;
  public user_manager_sub: Subscription;
  public parent_set = [];
  public btn_acl = {
    is_show_recharge: false,
    is_show_reduce: false,
    is_show_permission: false,
    is_show_reset_pwd: false,
    is_show_reset_fund_pwd: false,
    is_show_history: false,
    is_show_account_change: false,
    is_show_recharge_list: false,
    is_show_check_parent: false,
  };
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private betInfoProvider: BetInfoService,
    private router: Router,
    private modalService: NzModalService,
    private userManageService: UserManageService,
    private injector: Injector,
    private message: NzMessageService
  ) {
    console.log(Utils.acl_btn_list);
    this.check_btn_acl();

  }

  ngOnInit() {
    //获取列表第一页
    this.get_user_manage_list();
    //重制密码表单验证
    this.change_passport_apply = this.fb.group({
      apply_note: [null],
      password: [null, [Validators.required, Validators.pattern(Utils.RegExString.reg_ex_2)]],
      check_password: [null, [Validators.required, this.confirmation_passport]],
    });
    //冻结设置表单验证
    this.freeze_form = this.fb.group({
      username: [null, [Validators.required]],
      frozen_type: [null, [Validators.required]],
      comment: [null]
    });
    this.create_form = this.fb.group({
      recharge_num: [null, [Validators.required, Validators.pattern(Utils.RegExString.reg_ex_3)]],
      apply_note: [null]
    });
    //监听，在打开此路由情况下，创建用户刷新
    this.user_manager_sub = this.betInfoProvider.get_user_manager_update().subscribe(data => {
      if (data == 'update') {
        this.page_index = 1;
        this.get_user_manage_list();
      }
    });
  }
  /**
   * 验证所有按钮权限
   */
  public check_btn_acl() {
    let arry = Utils.acl_btn_list;
    this.btn_acl = {
      is_show_recharge: arry.indexOf('/manage/recharge') >= 0,
      is_show_reduce: arry.indexOf('/manage/reduce') >= 0,
      is_show_permission: arry.indexOf('/manage/permission-setting') >= 0,
      is_show_reset_pwd: arry.indexOf('/manage/reset-password') >= 0,
      is_show_reset_fund_pwd: arry.indexOf('/manage/reset-fund-password') >= 0,
      is_show_history: arry.indexOf('/manage/history') >= 0,
      is_show_account_change: arry.indexOf('/manage/account-change') >= 0,
      is_show_recharge_list: arry.indexOf('/manage/echarge-list') >= 0,
      is_show_check_parent: arry.indexOf('/manage/check-parent') >= 0,
    };
  }

  /**
   * 初始化时间
   */
  update_time() {
    this.start_time = this.change_date(new Date(), 'start');
    this.end_time = this.change_date(new Date(), 'end');
    this.now_date = [new Date(), new Date()];
  }
  /**
   * 用户账变记录
   */
  user_account_change(data) {
    this.look_history = true;
    this.drawer_type = 'account';
    this.history_list = [];
    this.edit_modal_o = data;
    this.update_time();
    this.get_user_account_change(data);

  }
  /**
   *获取账变列表
   *
   * @param {*} data
   * @memberof UserManageUserComponent
   */
  get_user_account_change(data) {
    let option = {
      user_id: data.id,
      start_time: this.start_time,
      end_time: this.end_time
    }
    this.spin_show = true;
    this.userManageService.user_account_change(option).subscribe((res: any) => {
      if (res && res.success) {
        this.history_list = res.data;
        this.spin_show = false;
      } else {
        this.spin_show = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *获取充值列表
   *
   * @param {*} data
   * @memberof UserManageUserComponent
   */
  get_user_recharge_history(data) {
    let option = {
      user_id: data.id,
      start_time: this.start_time,
      end_time: this.end_time
    }
    this.spin_show = true;
    this.userManageService.user_recharge_history(option).subscribe((res: any) => {
      if (res && res.success) {
        this.history_list = res.data;
        this.spin_show = false;
      } else {
        this.spin_show = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
 * 用户充值记录
 */
  user_recharge_history(data) {
    this.edit_modal_o = data;
    this.update_time();
    this.drawer_type = 'recharge';
    this.look_history = true;
    this.history_list = [];
    this.get_user_recharge_history(data);

  }
  /**
 * 金额输入框验证
 */
  account_check() {
    this.recharge_num = Utils.account_check(this.recharge_num, 90000);
  }

  /**
 *点击修改人工充值额度
 *
 * @param {*} data
 * @memberof OperasyonrechargeManageComponent
 */
  person_amount(data, type) {
    this.amount_type = type;
    this.is_show_recharge_num = true;
    this.now_edit_manage = data;
  }
  //取消人工充值弹框
  cancel_recharge_num() {
    this.isOkLoading = false;
    this.is_show_recharge_num = false;
  }

  //确定
  ok_recharge() {
    this.add_recharge_quota();
    this.isOkLoading = true;
  }
  /**
   *给管理员增加额度
   *
   * @memberof OperasyonQuotaManageComponent
   */
  add_recharge_quota() {

    if (this.amount_type == "add") {
      let option = {
        id: this.now_edit_manage['id'],
        amount: this.recharge_num,
        apply_note: this.apply_note ? this.apply_note : '确认人工充值'
      };
      this.submit_add(option);

    } else if (this.amount_type == "reduce") {
      let option = {
        user_id: this.now_edit_manage['id'],
        amount: this.recharge_num,
      };
      this.submit_reduce(option);

    }

  }
  /**
   * 
   * @param option 调用充值
   */
  submit_add(option) {
    this.userManageService.add_recharge_quota(option).subscribe((res: any) => {
      this.isOkLoading = false;
      this.isOkLoading = false;
      if (res && res.success) {
        this.search();
        this.recharge_num = null;
        this.apply_note = '';
        this.message.success('增加玩家金额成成功', {
          nzDuration: 10000,
        });
        this.cancel_recharge_num();
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }
  /**重置搜做参数 */
  resetSearch() {
    this.reset_search_data();
    this.page_index = 1;
    this.get_user_manage_list();
  }
  /**
 * 
 * @param option 调用扣减
 */
  submit_reduce(option) {
    this.userManageService.reduce_quota(option).subscribe((res: any) => {
      this.isOkLoading = false;
      this.isOkLoading = false;
      if (res && res.success) {
        this.search();
        this.recharge_num = null;
        this.apply_note = '';
        this.message.success('扣减玩家金额成功', {
          nzDuration: 10000,
        });
        this.cancel_recharge_num();
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  //---------冻结账户start
  /**
     *保存设置
     *
     * @memberof UserPermissionSettingComponent
     */
  keep_freeze() {
    let type = Utils.GetFreezeType(Number(this.freeze_obj['frozen_type']))
    this.modal_lodding = true;
    let option = {
      user_id: this.freeze_obj['user_id'],
      frozen_type: Number(this.freeze_obj['frozen_type']),
      comment: '[' + type + '] ==>' + (this.freeze_obj['comment'] ? this.freeze_obj['comment'] : '此用户异常'),
    };
    this.userManageService.submit_freeze(option).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.get_user_manage_list();
        this.is_edit_permission = false;
        for (const i in this.freeze_form.controls) {
          this.freeze_form.controls[i].markAsDirty();
          this.freeze_form.controls[i].updateValueAndValidity();
        }
        this.message.success('修改账户权限成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  //---------冻结账户end



  /**
   *获得修改权限历史
   *
   * @param {*} data
   * @memberof UserManageUserComponent
   */
  get_permission_history(data) {
    this.drawer_type = 'permission';
    this.look_history = true;
    this.update_time();
    this.history_list = [];
    this.edit_modal_o = data;
    this.get_permission_list(data);
  }
  /**
   * 获取历史 列表
   * @param data 
   */
  get_permission_list(data) {
    this.spin_show = true;
    let option = {
      user_id: data.id,
      start_time: this.start_time,
      end_time: this.end_time
    }
    this.userManageService.submit_freeze_history(option).subscribe((res: any) => {
      if (res && res.success) {
        this.history_list = res.data;
        this.spin_show = false;
      } else {
        this.spin_show = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *点击设置账户权限按钮
   *
   * @memberof UserManageUserComponent
   */
  setting_permission(data) {
    this.is_edit_permission = true;
    this.freeze_obj = {};
    this.freeze_obj['username'] = data['username'];
    this.freeze_obj['user_id'] = data['id'];
  }
  /**
   *提交修改密码
   *
   * @memberof UserManageUserComponent
   */
  submit_apply() {
    this.modal_lodding = true;
    let option = {
      "id": this.edit_change_passport_obj['id'],
      "password": this.change_passport_obj['password'],
      "apply_note": this.change_passport_obj['apply_note']
    }
    if (this.modal_type == 'login') {
      this.userManageService.submit_change_passport_apply(option).subscribe((res: any) => {
        this.modal_lodding = false;
        if (res && res.success) {
          this.is_edit_change_passport = false;
          this.modalService.info({
            nzTitle: '修改密码成功！',
            nzContent: '点击确定跳转审核！',
            nzOnOk: () => this.router.navigateByUrl('/manage/passport-check')
          });
          this.reseat_form();

        } else {
          this.is_edit_change_passport = false;
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    } else if (this.modal_type == 'prize') {
      this.userManageService.submit_change_prize_passport_apply(option).subscribe((res: any) => {
        this.modal_lodding = false;
        if (res && res.success) {
          this.is_edit_change_passport = false;
          this.modalService.info({
            nzTitle: '修改资金密码成功！',
            nzContent: '点击确定跳转审核！',
            nzOnOk: () => this.router.navigateByUrl('/manage/capital-passport-check')
          });
          this.reseat_form();


        } else {
          this.is_edit_change_passport = false;
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }
  }
  /**
   * 重置资金密码表单
   */
  reseat_form() {
    this.change_passport_obj = {};
    //重置资金密码表单
    for (const i in this.change_passport_apply.controls) {
      this.change_passport_apply.controls[i].markAsDirty();
      this.change_passport_apply.controls[i].updateValueAndValidity();
    }
    //重置密码表单
    for (const i in this.change_passport_apply.controls) {
      this.change_passport_apply.controls[i].markAsDirty();
      this.change_passport_apply.controls[i].updateValueAndValidity();
    }
    this.change_passport_apply.reset();
  }


  /**
  * *校验密码
  *
  * @memberof UserCreateGeneralAgentComponent
  */
  update_confirm_check_password(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.change_passport_apply.controls.check_password.updateValueAndValidity());
  }

  /**
*校验密码
*
* @memberof UserCreateGeneralAgentComponent
*/
  confirmation_passport = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.change_passport_apply.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  reset(): void {

    this.search();
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    this.search();
  }
  on_change_time_permission(result: Date[]): void {
    this.drawer_type = 'index';
    this.on_change_time(result);

  }
  on_change_time(result: Date[]): void {
    if (result.length == 0) {
      this.start_time = '';
      this.end_time = '';
    } else {
      this.start_time = this.change_date(result[0], 'start');
      this.end_time = this.change_date(result[1], 'end');
    }
    switch (this.drawer_type) {
      case 'account':
        this.get_user_account_change(this.edit_modal_o);
        break;
      case 'recharge':
        this.get_user_recharge_history(this.edit_modal_o);
        break;
      case 'permission':
        this.get_permission_list(this.edit_modal_o);
        break;
      case 'index':
        this.search();
        break;
    }

  }
  /**
   * 关闭修改密码弹框
   */
  close_reset_pwd() {
    this.is_edit_change_passport = false;
    this.reseat_form();
  }


  /**
   * GmT转时间格式 
   * */
  change_date(time, type) {
    let date = new Date(time);
    let mouth = (date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let Str = date.getFullYear() + '-' + mouth + '-' + day + ' ';
    return type == 'start' ? Str + '00:00:00' : Str + '23:59:59'
  }
  /**
   *改变页数
   *
   * @param {*} item
   * @memberof UserManageUserComponent
   */
  chang_page_index(item) {
    this.page_index = item;
    this.get_user_manage_list();
  }
  /**
   *点击修改登录密码
   *
   * @memberof UserManageUserComponent
   */
  edit_change_passport(data, type) {
    this.modal_type = type;
    //重置表单
    // for (const i in this.change_passport_apply.controls) {
    //   this.change_passport_apply.controls[i].markAsDirty();
    //   this.change_passport_apply.controls[i].updateValueAndValidity();
    // }
    this.reseat_form();
    this.edit_change_passport_obj = data;
    this.is_edit_change_passport = true;
  }
  /*
   *获取用户管理列表
   *
   * @memberof UserManageUserComponent
   */
  get_user_manage_list() {
    this.is_load_list = true;
    let option: any = {
      parent_name: 1,
      total_members: 1,
      parent_info: 1
    };
    if (this.searchData.id) option.id = this.searchData.id;
    if (this.searchData.username) option.username = this.searchData.username;
    if (this.searchData.parent_id) option.parent_id = this.searchData.parent_id;
    if (this.searchData.is_tester) option.is_tester = this.searchData.is_tester;
    if (this.searchData.type) option.type = this.searchData.type;
    // if (this.searchData.parent_name) option.parent_name = this.searchData.parent_name;
    if (this.start_time) option.start_time = this.start_time;
    if (this.end_time) option.end_time = this.end_time;
    this.userManageService.get_user_manage_list(this.page_index, option).subscribe((res: any) => {
      if (res && res.success) {
        this.list_total = res.data.total;
        this.is_load_list = false;
        if ((typeof res.data) === 'object' && !(res.data instanceof Array)) {
          this.listOfDisplayData = [];
          for (let x in res.data.data) {
            if (x === 'parentInfo') {

            } else {
              this.listOfDisplayData.push(res.data.data[x]);
            }
          }

        } else {

          this.listOfDisplayData = res.data.data;
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
   *根据匹配条件搜索
   *
   * @param {*} [page]
   * @memberof UserManageUserComponent
   */
  public search(): void {
    this.page_index = 1;
    this.parent_set = [];
    this.get_user_manage_list();
  }
  /**
   *
   * 寻找上级
   * @memberof UserManageUserComponent
   */

  public find_child(id, index?) {
    if (index >= 0) {
      this.parent_set.length = (index + 1);
    } else {
      this.parent_set = [];
    }
    this.reset_search_data();

    this.searchData.parent_id = id ? id : '';
    this.searchData.parent_name = id ? '1' : '';
    this.get_user_manage_list();
  }
  /**
   *重置搜索表单
   *
   * @memberof UserManageUserComponent
   */
  public reset_search_data() {
    this.searchData = {
      pageIndex: 1,
      pageSize: 15,
      id: '',
      is_tester: '',
      type: '',
      username: '',
      parent_id: '',
      parent_name: '',
    };
  }

  /**
   * 查看下级
   */
  public search_team(item) {
    this.parent_set = [];
    if (item.parent_username) {
      let name_array = item.parent_username.split(',');
      let id_array = item.rid.split('|');
      name_array.forEach((item, index) => {
        this.parent_set.push({
          id: id_array[index],
          name: item
        });
      });
    }
    this.reset_search_data();
    this.searchData.parent_id = item.id;
    this.searchData.parent_name = '1';
    this.get_user_manage_list();
  }

}
