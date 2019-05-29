import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';

@Component({
  selector: 'app-user-passport-check',
  templateUrl: './passport-check.component.html',
  styleUrls: ['./passport-check.component.less']
})
export class UserPassportCheckComponent implements OnInit {
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  public list_of_search_status: string;
  public is_load_list: boolean;
  public searchValue = '';
  public note_value: string;
  public sortName: string | null = null;
  public sortValue: string | null = null;
  public is_edit_check = false;
  public submit_passport_lodding = false;//提交修改密码按钮加载状态
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
    this.get_passport_aply_list(1);
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
*状态筛选改变
*
* @param {string[]} value
* @memberof UserManageUserComponent
*/
  is_status_change(value: string): void {
    this.list_of_search_status = value;
    this.search();
  }
  /**
*点击提交，驳回申请
*
* @param {*} type
* @memberof UserManageUserComponent
*/
  edit_check_passport(data, type) {
    this.is_edit_check = true;
    this.submit_passport_lodding = false;
    this.note_value = '';
    this.edit_check_obj = data;
    this.edit_check_obj['type'] = type;
  }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(page?): void {
    let option = {};//筛选条件
    if (this.list_of_search_status && this.list_of_search_status != '1000') {
      option['status'] = this.list_of_search_status;
    }
    // if(this.list_of_search_group&&this.list_of_search_group!='1000'){
    //   option['type']=this.list_of_search_group;
    // }
    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    this.get_passport_aply_list(page?page:1, option);
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
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_passport_aply_list(page_index, data?) {
    this.is_load_list = true;
    this.userManageService.get_passport_aply_list(page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index=page_index;
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_data = res.data;
        this.list_of_aply_data = [...this.list_of_data['data']];

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *提交审核
   *
   * @memberof UserPassportCheckComponent
   */
  submit_pass() {
    let option = {
      "id": this.edit_check_obj['id'],
      "type":1,
      "status": this.edit_check_obj['type'] === 'pass' ? 1 : 2,
      "auditor_note": this.note_value ? this.note_value : '审核人已确认'
    }
    this.submit_passport_lodding = true;
    this.userManageService.submit_pass_result(option).subscribe((res: any) => {
      this.submit_passport_lodding = false;
      if (res && res.success) {
        this.note_value = '';
        this.is_edit_check = false;
        this.get_passport_aply_list(this.page_index);

        this.message.success('提交审核结果成功', {
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
