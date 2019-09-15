import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';

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
  };
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;

  public is_load_list: boolean;

  public note_value: string;
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
  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_withdraw_aply_list();
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
    };
  }

  /**
  *点击提交，驳回申请
  *
  * @param {*} type
  * @memberof UserManageUserComponent
  */
  edit_check_withdraw(data, type) {
    this.is_edit_check = true;
    this.submit_withdraw_lodding = false;
    this.note_value = '';
    this.edit_check_obj = data;
    this.edit_check_obj['type'] = type;
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
  *提交审核
  *
  * @memberof UserwithdrawCheckComponent
  */
  submit_pass() {
    let option = {
      "id": this.edit_check_obj['id'],
      "type": 1,
      "status": this.edit_check_obj['type'] === 'pass' ? 1 : 2,
      "auditor_note": this.note_value ? this.note_value : '审核人已确认'
    }
    this.submit_withdraw_lodding = true;
    this.userManageService.submit_pass_result(option).subscribe((res: any) => {
      this.submit_withdraw_lodding = false;
      if (res && res.success) {
        this.note_value = '';
        this.is_edit_check = false;
        this.get_withdraw_aply_list();
        this.message.success('提交审核结果成功', {
          nzDuration: 10000,
        });
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }
}

