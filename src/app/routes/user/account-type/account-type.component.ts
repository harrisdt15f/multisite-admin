import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.less']
})
export class UserAccountTypeComponent implements OnInit {
//-----------条件筛选参数
public searchValue = '';
public choise_pay_type :string;
public choise_status :string;
public pay_type = [
  { text: '账变类型', value: 1 },
  { text: '微信', value: 2 },
  { text: '支付宝', value: 3},
  { text: '不限', value: 1000},
];
public status=[
  { text: '开启', value: '1' },
  { text: '关闭', value: '0'},
  { text: '不限', value: '1000'},
]




public page_index = 1;
public list_of_data: object = {};
public list_of_aply_data: Array<any> = [];
public param_list: Array<any> = [];
public param_list_data: Array<any> = [];
public list_total: number;
public is_load_list: boolean;
public show_text: string;
  //----------弹框
  public is_show_modal: boolean;
  public modal_type: string = 'create';
  public modal_lodding: boolean;
  public create_form: FormGroup;//表单对象
  public edit_account_obj: object = {

  };


  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    // this.get_system_setting_list();
    this.search(1);
    this.get_param_list();
    this.create_form = this.fb.group({
      name: [null, [Validators.required,Validators.maxLength(16)]],
      sign: [null, [Validators.required,Validators.maxLength(32),this.confirmValidator]],
      in_out: [null, [Validators.required]],
      param: [null]
   
    });

  }
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(control.value)||/[0-9]/.test(control.value)) {
      return { sign: true, error: true };
    }
    return {};
  };
  /**
   * 
   * @param value 需要的字段数组
   */
  change_param(value: string[]){


  }
  /**
   * 获取参数列表
   */
  get_param_list(){
    this.userManageService.get_param_list().subscribe((res: any) => {
      if (res && res.success) {
        this.param_list=[];
        res.data.forEach((item) => {
          this.param_list.push({
            label:item.label,
            value:item.id,
            checked:false
          })
          
        });
        console.log(this.param_list)
        this.param_list_data=JSON.parse(JSON.stringify(this.param_list));
   

      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonaccountManageComponent
   */
  add_account_submit(data) {
    this.userManageService.add_account_type(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.search(1);
        this.message.success('添加账变类型成功', {
          nzDuration: 10000,
        });
        this.hide_modal();
        this.update_form();

        this.is_show_modal = false;

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
   * @memberof OperasyonaccountManageComponent
   */
  edit_account_submit(data) {
    this.userManageService.edit_account_type(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.is_show_modal = false;
        this.search(1);
        this.update_form();
        this.hide_modal();
        this.message.success('修改账变类型成功', {
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
 * @memberof OperasyonaccountListComponent
 */
  update_form() {
    this.edit_account_obj = {
    }
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }

  /**
   *获取账变类型列表
   *
   * @param {*} page_index
   * @memberof OperasyonaccountManageComponent
   */
  get_account_list(page_index,data?) {
    this.is_load_list = true;
    this.userManageService.get_account_list(page_index,data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index;
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
   *点击添加账变类型
   *
   * @memberof OperasyonaccountManageComponent
   */
  add_account() {

    this.is_show_modal = true;
    this.modal_type = 'create';
    this.update_form();
    this.param_list=JSON.parse(JSON.stringify(this.param_list_data));
  }
 
 
  /**
   *点击编辑
   *
   * @memberof OperasyonaccountManageComponent
   */
  edit_account(data) {
    this.is_show_modal = true;
    this.modal_type = 'edit';
    this.param_list=JSON.parse(JSON.stringify(this.param_list_data));
    if(data.param){
      this.param_list.forEach((item) => {
       if(data.param.indexOf(item.value)>-1) {
        item.checked=true;
       }
      });

    }
    
    this.edit_account_obj = JSON.parse(JSON.stringify(data));
    this.edit_account_obj['in_out']=String(this.edit_account_obj['in_out']);
   
  }
  /**
   * 点击删除
   *
   * @memberof OperasyonaccountManageComponent
   */
  delete_account(data) {
    let option = {
      id: data.id
    }
    this.is_load_list = true;
    this.userManageService.delete_account_type(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.search(1);
        this.message.success('删除账变类型成功', {
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
   * @memberof OperasyonaccountManageComponent
   */
  filter_pay_type_change(value){
    this.choise_pay_type = value;
    this.search();
  }
  filter_status_change (value){
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
    if (this.choise_status && this.choise_status!= '1000') {
      option['status'] = this.choise_status;
    }
    if (this.searchValue) {
      option['title'] = this.searchValue;
    }
    this.get_account_list(page?page:1, option);

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









  submit_activity() {
    this.modal_lodding=true;
    let option = {
      id: this.edit_account_obj['id'],
      name: this.edit_account_obj['name'],
      sign: this.edit_account_obj['sign'],
      in_out: this.edit_account_obj['in_out'],
      type: 1,
      frozen_type: 0,
      activity_sign: 0,
    }
    if(this.param_list&&this.param_list.length>0){
      let array=[];
      this.param_list.forEach((item)=>{
        if(item.checked)array.push(item.value);
        if(array.length>0)option['param']=array;
      })

    }

    if (this.modal_type == 'create') {
      this.add_account_submit(option);
    } else if (this.modal_type == 'edit') {
      this.edit_account_submit(option);
    }

  }
  /**
 *隐藏图片模态kuang
 *
 * @memberof OperasyonActivityListComponent
 */
  hide_modal() {
    this.is_show_modal = false;
    this.update_form();
  }




}

