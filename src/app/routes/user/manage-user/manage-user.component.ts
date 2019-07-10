import { Component, OnInit, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { startOfMonth } from 'date-fns';
import { UserManageService } from 'app/service/user-manage.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BetInfoService } from 'app/provider/bet-info/bet-info.service';
import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-user-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['manege-user.component.less']
})
export class UserManageUserComponent implements OnInit {

  public edit_change_passport_obj: object = {};//点击的用户对象
  public now_date = [new Date(), new Date()];

  public ranges1 = {
    "今日": [new Date(), new Date()],
    '本月': [startOfMonth(new Date()), new Date()]
  };
  public searchValue = '';

  public sortName: string | null = null;
  public sortValue: string | null = null;
  public mapOfExpandData: { [key: string]: boolean } = {};

  /**
   *用户组筛选菜单
   *
   * @memberof UserManageUserComponent
   */
  public list_of_total = [
    { text: '总代', value: '1' },
    { text: '代理', value: '2' },
    { text: '玩家', value: '3' },
    { text: '不限', value: '1000' },
  ];
  /**
   *是否测试用户筛选菜单
   *
   * @memberof UserManageUserComponent
   */
  public is_test_user = [
    { text: '是', value: '1' },
    { text: '否', value: '0' },
    { text: '不限', value: '1000' },
  ];
  public list_of_search_group: string;
  public list_of_search_is_test: string;
  public change_passport_obj: object = {};
  public listOfData: object = {};
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
  public edit_modal_o: object={};
  public drawer_title = {
    account: '账变记录历史',
    recharge: '充值记录历史',
    permission: '权限冻结历史'
  };

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
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private betInfoService: BetInfoService,
    private router: Router,
    private userManageService: UserManageService,
    private injector: Injector,
    private message: NzMessageService
  ) {

  }

  ngOnInit() {
    //获取列表第一页
    this.get_user_manage_list(1);
    //重制密码表单验证
    this.change_passport_apply = this.fb.group({
      apply_note: [null],
      password: [null, [Validators.required]],
      check_password: [null, [Validators.required, this.confirmation_passport]],

    });
    //冻结设置表单验证
    this.freeze_form = this.fb.group({
      username: [null, [Validators.required]],
      frozen_type: [null, [Validators.required]],
      comment: [null]
    });
  }
/**
 * 初始化时间
 */
  update_time(){
    this.start_time=this.change_date(new Date(),'start');
    this.end_time=this.change_date(new Date(),'end');
    this.now_date = [new Date(), new Date()];
  }
  /**
   * 用户账变记录
   */
  user_account_change(data) {
    this.look_history = true;
    this.drawer_type = 'account';
    this.history_list = [];
    this.edit_modal_o=data;
    this.update_time();
    this.get_user_account_change(data);
   
  }
  get_user_account_change(data){
    let option = {
      user_id: data.id,
      start_time:this.start_time,
      end_time:this.end_time
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
  get_user_recharge_history(data){
    let option = {
      user_id: data.id,
      start_time:this.start_time,
      end_time:this.end_time
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
    this.edit_modal_o=data;
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
  person_amount(data,type) {
    this.amount_type=type;
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

    if(this.amount_type=="add"){
      let option = {
        id: this.now_edit_manage['id'],
        amount: this.recharge_num,
        apply_note: this.apply_note?this.apply_note:'确认人工充值'
      };
      this.submit_add(option);

    }else if(this.amount_type=="reduce"){
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
  submit_add(option){

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
    })
  }
  /**
 * 
 * @param option 调用扣减
 */
  submit_reduce(option){
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
    this.edit_modal_o=data;
    this.get_permission_list(data);

  }
  /**
   * 获取历史 列表
   * @param data 
   */
  get_permission_list(data){
    this.spin_show = true;
    let option = {
      user_id: data.id,
      start_time:this.start_time,
      end_time:this.end_time
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
    this.freeze_obj['username'] = data['nickname'];
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
          this.message.success('提交修改登录成功', {
            nzDuration: 10000,
          });
          //重置表单
          for (const i in this.change_passport_apply.controls) {
            this.change_passport_apply.controls[i].markAsDirty();
            this.change_passport_apply.controls[i].updateValueAndValidity();
          }

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
          this.message.success('提交修改资金密码成功', {
            nzDuration: 10000,
          });
          //重置表单
          for (const i in this.change_passport_apply.controls) {
            this.change_passport_apply.controls[i].markAsDirty();
            this.change_passport_apply.controls[i].updateValueAndValidity();
          }

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
    this.searchValue = '';
    this.search();
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    this.search();
  }
  on_change_time_permission(result: Date[]): void {
    this.drawer_type='index';
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
    this.search(item);
    // this.get_user_manage_list(item);
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
    this.change_passport_obj = {};



    this.edit_change_passport_obj = data;
    this.is_edit_change_passport = true;

  }
  /*
  *
   *获取用户管理列表
   *
   * @memberof UserManageUserComponent
   */
  get_user_manage_list(page_index, data?) {
    this.is_load_list = true;
    this.userManageService.get_user_manage_list(page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index;
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.listOfData = res.data;
        this.listOfDisplayData = [...this.listOfData['data']];

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *用户组筛选改变
   *
   * @param {string[]} value
   * @memberof UserManageUserComponent
   */
  filter_user_group_change(value: string): void {
    this.list_of_search_group = value;
    this.search();
  }
  /**
 *用户组筛选改变
 *
 * @param {string[]} value
 * @memberof UserManageUserComponent
 */
  is_test_user_change(value: string): void {
    this.list_of_search_is_test = value;
    this.search();
  }
  /**
   *根据匹配条件搜索
   *
   * @param {*} [page]
   * @memberof UserManageUserComponent
   */
  search(page?): void {

    let option = {};//筛选条件
    if (this.list_of_search_is_test && this.list_of_search_is_test != '1000') {
      option['is_tester'] = Number(this.list_of_search_is_test);
    }
    if (this.list_of_search_group && this.list_of_search_group != '1000') {
      option['type'] = this.list_of_search_group;
    }
    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    if (this.start_time) {
      option['start_time'] = this.start_time;
    }
    if (this.end_time) {
      option['end_time'] = this.end_time;
    }

    this.get_user_manage_list(page ? page : 1, option);
  }

}
