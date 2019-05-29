import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { GameService } from 'app/service/game.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-game-lottery-issue',
  templateUrl: './lottery-issue.component.html',
  styleUrls: ['./lottery-issue.component.less']
})
export class GameLotteryIssueComponent implements OnInit {
  public lotteries_tabs = [];
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

  public submit_passport_lodding = false;//提交修改密码按钮加载状态
  public edit_check_obj: object = {
    type: 'pass'
  };
  public status_type = [
    { text: '待审核', value: '0' },
    { text: '审核通过', value: '1' },
    { text: '审核拒绝', value: '1000' },
  ];


  public tab_index: number = 0;

  //-------------弹框参数
  public visible_modal = false;
  public create_form: FormGroup;//表单对象
  public modal_lodding: boolean;//显示加载图标
  public create_lottery_obj: object = {};//显示加载图标
  public lotteries_list: Array<any> = [
    {
      title: '重庆时时彩',
      id: 'cqssc'
    }
  ];
  constructor(
    private http: _HttpClient,
    private gameService: GameService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.search();
    this.get_lotteries_type();
    this.create_form = this.fb.group({
      lottery_id: [null, [Validators.required]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
    });
  }
  /**
   *生成奖期间
   *
   * @memberof GameLotteryIssueComponent
   */
  create_issue() {
    let start_time = Utils.change_date(this.create_lottery_obj['start_time'],'date');
    let end_time = Utils.change_date(this.create_lottery_obj['end_time'],'date');
    var option = {
      "lottery_id": this.create_lottery_obj['lottery_id'],
      "start_time": start_time,
      "end_time": end_time,
      "start_issue": ''

    };
    this.modal_lodding=true;
 
    this.gameService.create_issue(option).subscribe((res: any) => {
      this.visible_modal = false;
      this.modal_lodding=false;
      if (res && res.success) {
        this.message.success('生成奖期成功', {
          nzDuration: 10000,
        });
        this.search();
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })

  }
  /**
  *开始时间变化
  *
  * @memberof OperasyonActivityListComponent
  */
  on_change_start(item) { }
  /**
 *开始时间确定
 *
 * @memberof OperasyonActivityListComponent
 */
  on_ok_start(item) { }
  /**
 *结束时间变化
 *
 * @memberof OperasyonActivityListComponent
 */
  on_change_end(item) { }
  /**
*结束时间确定
*
* @memberof OperasyonActivityListComponent
*/
  on_ok_end(item) { }
  /**
 *切换tab
 *
 * @memberof GameGameTypeComponent
 */
  change_index(index: number) {
    this.tab_index = index;
    this.search()

  }
  /**
   *点击生成奖期号
   *
   * @memberof GameLotteryIssueComponent
   */
  show_create_lottery() {
    this.visible_modal = true;
  }
  /*
 *
 *获取采种系列
 *
 * @memberof UserManageUserComponent
 */
  get_lotteries_type() {
    this.gameService.get_lotteries_type().subscribe((res: any) => {
      if (res && res.success) {
        this.lotteries_tabs = [
          {
            label: '最新',
            value: 10086
          }
        ];
        for (let key in res.data) {
          this.lotteries_tabs.push({
            label: res.data[key],
            value: key
          }
          )
        }
        // this.get_lotteries_list(this.lotteries_tabs[0].value,0)
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
  // edit_check_passport(data, type) {
  //   this.is_edit_check = true;
  //   this.submit_passport_lodding = false;
  //   this.note_value = '';
  //   this.edit_check_obj = data;
  //   this.edit_check_obj['type'] = type;
  // }
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

    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    this.get_issue_list(page ? page : 1, option);
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
*获取奖期列表
*
* @memberof UserManageUserComponent
*/
  get_issue_list(page_index, data?) {
    this.is_load_list = true;
    var option = {}
    if (this.tab_index != 0 && this.lotteries_tabs[this.tab_index].value) {
      data.series_id = this.lotteries_tabs[this.tab_index].value
    }
    this.gameService.get_issue_list(page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index;
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
  // submit_pass() {
  //   let option = {
  //     "id": this.edit_check_obj['id'],
  //     "type": 2,
  //     "status": this.edit_check_obj['type'] === 'pass' ? 1 : 2,
  //     "auditor_note": this.note_value ? this.note_value : '审核人已确认'
  //   };
  //   this.submit_passport_lodding = true;
  // this.gameService.submit_pass_result(option).subscribe((res: any) => {
  //   this.submit_passport_lodding = false;
  //   if (res && res.success) {
  //     this.note_value = '';
  //     this.is_edit_check = false;
  //     this.get_issue_list(this.page_index);

  //     this.message.success('提交审核结果成功', {
  //       nzDuration: 10000,
  //     });
  //   } else {

  //     this.message.error(res.message, {
  //       nzDuration: 10000,
  //     });
  // }
  // })
  // }

}
