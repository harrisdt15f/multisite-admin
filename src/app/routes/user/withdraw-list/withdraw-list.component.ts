import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { ApiService } from '../../../../api/api.service';

import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-user-withdraw-list',
  templateUrl: './withdraw-list.component.html',
})
export class UserWithdrawListComponent implements OnInit {

  // 搜索对象
  public searchData = {
    pageIndex: 1,
    pageSize: '100',
    status: '',
    username: '',
    order_id: '',
    time_condtions: []
  };
  public createdAt = {
    start: '',
    end: ''
  }
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;

  public is_load_list: boolean;

  // public note_value: string;
  public sortName: string | null = null;
  public sortValue: string | null = null;
  public is_edit_check = false;
  public submit_withdraw_lodding = false;//按钮加载状态
  public edit_check_obj: object = {
    type: 'pass'
  };
  public status_type = [
    { text: '待审核', value: '0' },
    { text: '审核通过', value: '1' },
    { text: '审核拒绝', value: '1000' },
  ];

  public detail_data_pop: boolean;
  public objectKeys = Object.keys;

  //充值渠道
  public payment_list: Array<any> = [];

  //操作状态
  public withdraw_remark: string;
  public withdraw_data: any = {};
  public withdraw_channel_id: string;
  public withdraw_pop_type: string;

  public withdraw_sreach_date = {
    start_time : '',
    end_time : '',
  };
  public withdraw_detail_data: object = {};

  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private message: NzMessageService,
    private newHttp: ApiService,
  ) { }

  ngOnInit() {
    this.get_withdraw_aply_list();
    this.get_payment_info();
  }

  /**
   * 获取充值渠道
   */
  get_payment_info() {
    const url = '/api/reportManagement/payment-info';
    this.newHttp.request({
      type: 'get',
      url
    }).subscribe( res => {
       const {payments} = res['data'];
       this.payment_list = payments;
    });
  }

  /**
  * 重置搜做参数
  */
  resetSearch() {
    this.reset_search_data();
    this.page_index = 1;
    this.get_withdraw_aply_list();
  }
  /**
  * 重置搜索表单
  */
  public reset_search_data() {
    this.searchData = {
      pageIndex: 1,
      pageSize: '100',
      status: '',
      username: '',
      order_id: '',
      time_condtions: []
    };
    this.createdAt = {
      start : '',
      end : ''
    };
  }

  /**
  *点击提交，驳回申请
  *
  * @param {*} type
  * @memberof UserManageUserComponent
  */
  edit_check_withdraw(data, type) {
    const reject = data.status === 1 && type === 'reject';
    const four = data.status === 4 && type === '4';
    if ( !reject && !four) {
      this.submit_withdraw_lodding = false;
      const url = '/api/withdraw/status';
      const option = {
        id: data.id,
        status : type
      };
      if ( type === 'reject' || type === 'pass' ) {
        this.is_edit_check = true;
        this.withdraw_remark = '';
        this.withdraw_data = data;
        this.withdraw_pop_type = type;
      } else {
        if ( type === '1' ) {
          this.is_edit_check = false;
          Object.assign(option, { remark : this.withdraw_remark });
          this.withdraw_remark = '';
        }
        if ( type === '2' ) {
          this.is_edit_check = false;
          Object.assign(option, { channel_id : this.withdraw_channel_id });
          this.withdraw_channel_id = null;
        }
        this.newHttp.request({
          type: 'post',
          url,
          data: option
        }).subscribe( res => {
          if (res['success'] ) {
            this.message.success('提交结果成功', {nzDuration: 10000,});
            this.resetSearch();
            this.get_withdraw_aply_list();
          }
        });
      }
    }
  }

  /**
  *搜索数组
  *
  * @memberof UserwithdrawCheckComponent
  */
  search() {
    this.page_index = 1;
    this.get_withdraw_aply_list();
  }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    this.page_index = item;
    this.get_withdraw_aply_list();
  }
  /*
  *
  *获取用户管理列表
  *
  * @memberof UserManageUserComponent
  */
  get_withdraw_aply_list() {
    this.is_load_list = true;
    let option: any = {};
    let { searchData } = this;
    for (const key in searchData) {
      if (searchData[key] && key !== 'time_condtions') {
        option[key] = searchData[key];
      }
    }
    if (this.createdAt['start'] || this.createdAt['end']) {
      const start = Utils.change_date_string(this.createdAt['start']);
      const end = Utils.change_date_string(this.createdAt['end']);
      option['time_condtions'] = `[["created_at", ">=", "${start}"], ["created_at", "<=", "${end}"]]`;
    }
    const url = '/api/reportManagement/withdraw-record';
    this.newHttp.request({
      type: 'post',
      url,
      data: option
    }).subscribe((res: any) => {
      if (res && res.success) {
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_aply_data = res.data.data;
      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }
  /**
   * 提现详情列表
   * @param data 
   */
  public get_data_detail(data: any) {
    this.withdraw_detail_data = {};
    this.detail_data_pop = true;
    if ( data ) {
      this.withdraw_data = data;
    }
    const id = this.withdraw_data['id'];
    const {start_time, end_time} = this.withdraw_sreach_date;
    const url = `/api/withdraw/show?id=${id}${
      start_time !== '' ? '&start_time=' + Utils.change_date_string(start_time) : ''}${
        end_time !== '' ? '&end_time=' + Utils.change_date_string(end_time) : ''}`;
    this.newHttp.request({
      type: 'get',
      url
    }).subscribe( res => {
      const {data , success} = res;
      if (success) this.withdraw_detail_data = data;
      this.withdraw_sreach_date['start_time'] = '';
      this.withdraw_sreach_date['end_time'] = '';
    });
  }
  public get_success_data(data: any){
    let newObj = {};
    for (const key in data) {
      if (typeof data[key] === 'number') {
        newObj[key] = data[key];
      }
    }
    return newObj;
  }
  cancel() {}
}

