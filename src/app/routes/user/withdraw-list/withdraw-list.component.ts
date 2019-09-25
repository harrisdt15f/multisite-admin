import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { ApiService } from '../../../../api/api.service';

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
    id: '',
    payment: '',
    orderId: '',
    createdAt: '',
    processTime: '',
  };
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
  public detail_data_row = {};
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
  public withdraw_detail_data = {
    user_id : '',
    user_status : '',
    remark : '',
    order_id : '',
    user_balance : '',
    usable_balance : '',
    can_withdraw_balance : '',
    is_tester : '',
    that_day_recharege_amount : '',
    that_day_withdraw_amount : '',
    that_day_bet_amount : '',
    created_at : '',
    amount : '',
    bank_name : '',
    card_number : '',
    card_username : '',
    province : '',
    branch : '',
    branch_address : '',
    fail_remark : '',
    check_remark : '',
    status : '',
    claimant : '',
    claim_time : '',
    audit_manger : '',
    audit_time : '',
    updated_at : '',
    service_fee : '',
    remittance_amount : '',
    channel : '',
    ip : ''
  };

  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private message: NzMessageService,
    private newHttp: ApiService
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
      id: '',  //编号
      payment: '', //渠道
      orderId: '', //订单号
      createdAt: '', //创建时间
      processTime: '' //成功时间
    };
    // 带注释的key 未与后台通报
  }

  /**
  *点击提交，驳回申请
  *
  * @param {*} type
  * @memberof UserManageUserComponent
  */
  edit_check_withdraw(data, type) {
    this.submit_withdraw_lodding = false;
    const url = '/api/withdraw/status';
    const option = {
      id: data.id,
      status : type
    };
    // this.note_value = '';
    // this.edit_check_obj = data;
    // this.edit_check_obj['type'] = type;
    if ( type === 'reject' || type === 'pass' ) {
      this.is_edit_check = true;
      this.withdraw_remark = '';
      this.withdraw_data = data;
      this.withdraw_pop_type = type;
    } else {
      // tslint:disable-next-line: triple-equals
      // tslint:disable-next-line: no-unused-expression
      if ( type === '1' ) {
        this.is_edit_check = false;
        Object.assign(option, { remark : this.withdraw_remark });
        this.withdraw_remark = '';
      }
      if ( type === '2' ) {
        this.is_edit_check = false;
        Object.assign(option, { channel_id : this.withdraw_channel_id });
        this.withdraw_channel_id = '';
      }
      this.newHttp.request({
        type: 'post',
        url,
        data: option
      }).subscribe( res => {
        if (res['success'] ) {
          this.message.success('提交结果成功', {nzDuration: 10000,});
          this.get_withdraw_aply_list();
        }
      });
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
    if (this.searchData.username) option.username = this.searchData.username;
    if (this.searchData.status) option.status = this.searchData.status;
    this.userManageService.get_withdraw_check_list(this.searchData.pageSize, this.page_index, option).subscribe((res: any) => {
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
  get_data_detail(data: any) {
    this.detail_data_pop = true;
    if ( data ) {
      this.withdraw_data = data;
    }
    const option = {
      id : this.withdraw_data['id']
    };
    const {start_time, end_time} = this.withdraw_sreach_date;
    start_time && Object.assign(option, {start_time});
    end_time && Object.assign(option, {end_time});
    const url = `/api/withdraw/show`;
    this.newHttp.request({
      type: 'post',
      url,
      data: option
    }).subscribe( res => {
      console.log('detail', res, this.withdraw_data);
    });
  }

  cancel() {}
}

