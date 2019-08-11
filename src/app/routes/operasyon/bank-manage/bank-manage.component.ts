import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-operasyon-bank-manage',
  templateUrl: './bank-manage.component.html',
  styleUrls: ['./bank-manage.component.less']
})
export class OperasyonBankManageComponent implements OnInit {
  //-----------条件筛选参数
  public searchValue = '';
  public choise_pay_type: string;
  public choise_status: string;
  public pay_type = [
    { text: '银行', value: 1 },
    { text: '微信', value: 2 },
    { text: '支付宝', value: 3 },
    { text: '不限', value: 1000 },
  ];
  public status = [
    { text: '开启', value: '1' },
    { text: '关闭', value: '0' },
    { text: '不限', value: '1000' },
  ]



  html: string;
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;
  public show_text: string;

  //--------------弹框参数
  public if_show_modal: boolean;
  public modal_type: string = 'create';
  public create_form: FormGroup;//表单对象
  public modal_lodding: boolean;//显示加载图标
  public edit_bank_obj: object = {
    allow_user_level: 1
  };

  public html_content: string = '';
  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.create_form = this.fb.group({
      title: [null, [Validators.required]],
      code: [null, [this.confirmValidator]],
      min_recharge: [null, [Validators.required]],
      pay_type: [null, [Validators.required]],
      allow_user_level: [null, [Validators.required]],
      max_recharge: [null, [this.confirm_max_recharge]],
      min_withdraw: [null, [Validators.required]],
      max_withdraw: [null, [this.max_withdraw_recharge]],
      status: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
    });
    this.search(1);
  }


  formatter(value: number): string {
    var num = (10 - value + 1)
    return String(num);
  }
  /**
 * 充值金额校验 
 * */
  confirm_max_recharge = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!this.create_form.controls.min_recharge.value) {
      return { not_pass1: true, error: true };
    } else if (control.value <= this.create_form.controls.min_recharge.value) {
      return { not_pass2: true, error: true };
    }
    return {};
  };

  /**
  * 提现金额校验 
  * */
  max_withdraw_recharge = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!this.create_form.controls.min_withdraw.value) {
      return { not_pass1: true, error: true };
    } else if (control.value <= this.create_form.controls.min_withdraw.value) {
      return { not_pass2: true, error: true };
    }
    return {};
  };
  /**
   * 编码校验 
   * */
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(control.value) || /[0-9]/.test(control.value)) {
      return { code: true, error: true };
    }
    return {};
  };
  /**
  *修改开启状态
  *
  * @param {*} e
  * @param {*} data
  * @memberof OperasyonBankManageComponent
  */
  edit_status(e, data) {
    let option = {
      id: data['id'],
      title: data['title'],
      code: data['code'],
      pay_type: data['pay_type'],
      min_recharge: data['min_recharge'],
      max_recharge: data['max_recharge'],
      min_withdraw: data['min_withdraw'],
      max_withdraw: data['max_withdraw'],
      status: e ? 1 : 0,
      allow_user_level: data['allow_user_level'],
      remarks: data['remarks'],
    };
    this.edit_bank_submit(option);
  }


  /**
   *提交
   *
   * @memberof OperasyonbankManageComponent
   */
  submit_bank() {
    let option = {
      id: this.edit_bank_obj['id'],
      title: this.edit_bank_obj['title'],
      code: this.edit_bank_obj['code'],
      pay_type: this.edit_bank_obj['pay_type'],
      min_recharge: this.edit_bank_obj['min_recharge'],
      max_recharge: this.edit_bank_obj['max_recharge'],
      min_withdraw: this.edit_bank_obj['min_withdraw'],
      max_withdraw: this.edit_bank_obj['max_withdraw'],
      status: this.edit_bank_obj['status'],
      allow_user_level: '',
      remarks: this.edit_bank_obj['remarks'],
    };
    let level = []
    for (let i = 10; i >= (10 - this.edit_bank_obj['allow_user_level'] + 1); i--) {
      level.unshift(i)
    }
    option['allow_user_level'] = level.join(',');
    this.modal_lodding = true;
    if (this.modal_type == 'create') {
      this.add_bank_submit(option);
    } else if (this.modal_type == 'edit') {
      this.edit_bank_submit(option);
    }

  }
  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonbankManageComponent
   */
  add_bank_submit(data) {
    this.userManageService.add_bank(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.search(1);
        this.message.success('添加银行成功', {
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
   *调用修改
   *
   * @param {*} data
   * @memberof OperasyonbankManageComponent
   */
  edit_bank_submit(data) {
    this.userManageService.edit_bank(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.if_show_modal = false;
        this.search(1);
        this.update_form();
        this.message.success('修改银行数据成功', {
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
 *d刷新表单
 *
 * @memberof OperasyonbankListComponent
 */
  update_form() {

    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }

  /**
   *获取银行列表
   *
   * @param {*} page_index
   * @memberof OperasyonbankManageComponent
   */
  get_bank_list(page_index, data?) {
    this.is_load_list = true;
    this.userManageService.get_bank_list(page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_data = res.data;
        this.list_of_aply_data = [...this.list_of_data['data']];

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 关闭莫泰框
   */
  close_modal() {
    this.if_show_modal = false;
    this.update_form();
  }
  /**
   *点击添加银行
   *
   * @memberof OperasyonbankManageComponent
   */
  add_bank() {

    this.if_show_modal = true;
    this.modal_type = 'create';
    this.edit_bank_obj = {
      content: '',
      allow_user_level: 1
    }
    this.edit_bank_obj['allow_user_level'] = 1;
  }


  /**
   *点击编辑
   *
   * @memberof OperasyonbankManageComponent
   */
  edit_bank(data) {
    this.if_show_modal = true;
    this.modal_type = 'edit';
    // this.update_form();
    this.edit_bank_obj = JSON.parse(JSON.stringify(data));
    this.edit_bank_obj['status'] = String(this.edit_bank_obj['status']);
    this.edit_bank_obj['pay_type'] = String(this.edit_bank_obj['pay_type']);
    this.edit_bank_obj['allow_user_level'] = 10 - this.edit_bank_obj['allow_user_level'].split(',')[0] + 1;
  }
  /**
   * 点击删除
   *
   * @memberof OperasyonbankManageComponent
   */
  delete_bank(data) {
    let option = {
      id: data.id
    }
    this.is_load_list = true;
    this.userManageService.delete_bank(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.search(1);
        this.message.success('删除银行成功', {
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
   *取消搜索
   *
   * @memberof UserPassportCheckComponent
   */
  reset(): void {
    this.searchValue = '';
    this.search();
  }
  /**
   *筛选支付方式
   *
   * @param {*} value
   * @memberof OperasyonBankManageComponent
   */
  filter_pay_type_change(value) {
    this.choise_pay_type = value;
    this.search();
  }
  filter_status_change(value) {
    this.choise_status = value;
    this.search();
  }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(page?): void {
    let option = {};//筛选条件
    if (this.choise_pay_type && Number(this.choise_pay_type) != 1000) {
      option['pay_type'] = this.choise_pay_type;
    }
    if (this.choise_status && this.choise_status != '1000') {
      option['status'] = this.choise_status;
    }
    if (this.searchValue) {
      option['title'] = this.searchValue;
    }
    this.get_bank_list(page ? page : 1, option);

  }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    this.search(item);
  }

}
