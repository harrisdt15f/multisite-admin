import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

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
  public input_number_rule_obj: object = {};//彩种信息对象
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  public up_time: any;

  public is_loading_enco: boolean;
  public is_load_list: boolean;
  public is_visible_input: boolean;//显示手动录号弹框

  public choise_lottery = '0';
  public previous_number = '0';
  public note_value: string;
  public sortName: string | null = null;
  public sortValue: string | null = null;
  public submit_passport_lodding = false;//提交修改密码按钮加载状态
  public edit_check_obj: object = {};
  public status_type: Array<any> = [];
  public tab_index: number = 0;
  public search_number: string;
  public encode_splitter: object = {};

  // 搜索的时间
  public searchTime = null;


  //-------------弹框参数
  public code_value: string;
  public visible_modal = false;
  public create_form: FormGroup;//表单对象
  public modal_lodding: boolean;//显示加载图标
  public create_lottery_obj: object = {};//显示加载图标
  public lotteries_list: Array<any> = [];
  public code_rule: string;
  public time: Date;
  public every_day_time: string;
  public is_visible_edit_time: boolean;
  public is_lodding_modal: boolean;
  public is_loading_edit_time: boolean;
  public input_number_obj: object = {};//录号弹框对象
  // 删除奖期参数
  public deleteLotteriesData = {
    type: '',
    id: [],
    lottery: '',
    day: ''
  };
  public isAllDisplayDataChecked = false;
  public isIndeterminate = false;
  public mapOfCheckedId: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private gameService: GameService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {
    this.status_type = [
      { text: '待审核', value: '0' },
      { text: '审核通过', value: '1' },
      { text: '审核拒绝', value: '1000' },
    ]
    this.edit_check_obj = {
      type: 'pass'
    }
  }

  ngOnInit() {
    this.time = new Date();
    this.search();
    this.get_lotteries_type();
    this.get_input_num_rule();
    this.get_time_setting();
    this.create_form = this.fb.group({
      lottery_id: [null, [Validators.required]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
    });
    this.foreach_time();
  }
  foreach_time() {
    setInterval(() => {
      let now_time = new Date().getTime() / 1000;
      if (this.up_time && now_time >= this.up_time) {
        setTimeout(() => {
          this.search();
          this.up_time = null;
        }, 3000)

      }
    }, 10000)

  }

  /**
   * 点击重新派奖
   */
  calculate_encode_again(item) {
    let option = {
      id: item.id
    }
    this.is_loading_enco = true;
    this.gameService.calculate_encode_again(option).subscribe((res: any) => {
      this.is_loading_enco = false;
      if (res && res.success) {
        this.message.success('重新派奖成功', {
          nzDuration: 2500,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 2500,
        });
      }
    })
  }
  /**
   * 全选
   */
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.list_of_aply_data.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.list_of_aply_data.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    console.log(this.mapOfCheckedId);
    console.log(this.isIndeterminate);
  }
  /**
   * 表格全选
   */
  checkAll(value: boolean): void {
    this.list_of_aply_data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  /**
   * 选采种变化
   */
  change_lotteries() {
    this.previous_number = '1';
  }
  /**
   * 删除奖期时间选择
   */
  onChangePickTime(time) {

  }
  /**
 * 删除奖期
 */
  deleteLotteries() {
    let option: any = {
      type: this.deleteLotteriesData.type,
    };
    if (!this.deleteLotteriesData.type) {
      this.modalService.error({
        nzTitle: '温馨提示！',
        nzContent: '请选择要删除的奖期类型！'
      });
      return;
    } else if (this.deleteLotteriesData.type === '1') {
      option.id = []
      for (let x in this.mapOfCheckedId) {
        if (this.mapOfCheckedId[x]) {
          option.id.push(x);
        }
      }
    } else if (this.deleteLotteriesData.type === '2') {
      if (this.deleteLotteriesData.day && this.choise_lottery !== '0') {
        option.lottery = this.choise_lottery;
        option.day = Utils.changeDateNumber(this.deleteLotteriesData.day);
      } else if (this.choise_lottery == '0') {
        this.modalService.error({
          nzTitle: '温馨提示！',
          nzContent: '请先选择彩种！'
        });
        return;
      } else if (!this.deleteLotteriesData.day) {
        this.modalService.error({
          nzTitle: '温馨提示！',
          nzContent: '请先选择要删除奖期的时间！'
        });
        return;
      }
    }
    this.gameService.deleteLotteriesLssues(option).subscribe((res: any) => {
      if (res && res.success) {
        this.search_lotteries();
        this.checkAll(false);
        this.message.success('删除奖期成功！', {
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
   * 切换删除奖期类型
   */
  changeDeletLotType(type) {
    switch (type) {
      case '1':
        this.deleteLotteriesData.day = '';
        break;
      case '2':
        this.checkAll(false);
        break;
    }

  }

  /**
   * 获取录号规则
   */
  get_input_num_rule() {
    this.gameService.get_input_num_rule().subscribe((res: any) => {
      if (res && res.success) {
        this.input_number_rule_obj = {};
        res.data.forEach((data) => {
          this.input_number_rule_obj[data.en_name] = {
            code_length: data.code_length,
            en_name: data.en_name,
            valid_code: data.valid_code
          }
        })



      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 手动录号
   */
  handle_ok() {
    let result = this.check_code_rule(1);
    if (!result) return;
    let option = {
      lottery_id: this.input_number_obj['obj'].lottery_id,
      issue: this.input_number_obj['obj'].issue,
      code: this.code_value
    }
    this.is_lodding_modal = true;
    this.gameService.input_number_value(option).subscribe((res: any) => {
      this.is_lodding_modal = false;
      if (res && res.success) {
        this.handle_cancel();
        this.message.success('手动录号成功', {
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
   * 取消录号
   */
  handle_cancel() {
    this.is_visible_input = false;
  }
  /**
   * 
   * @param code 检查录号格式
   * @param issu_obj 
   */
  check_code_rule(type?) {
    let code = this.code_value;
    let issu_obj: any = this.input_number_obj;
    let status = true;
    let split_icon = this.encode_splitter[this.input_number_obj['obj'].lottery.series_id];
    let code_array = code.split(split_icon);
    let valid_code = issu_obj.valid_code.split(',');
    if (!(code_array.length == issu_obj.code_length)) {
      status = false;
    } else {
      code_array.forEach((item) => {
        if (valid_code.indexOf(item) < 0) {
          status = false;
        }
      });
    }
    if (!status) {
      const modal = this.modalService.error({
        nzTitle: '录号格式错误！',
        nzContent: '请检查是否符合规则:' + this.code_rule
      });
    } else if (!type && status) {
      const modal = this.modalService.success({
        nzTitle: '录号格式正确！！'
      });
    }
    return status;

  }


  /**
   * 点击录号
   */
  input_number(data) {
    let separator = null;
    for (let i of this.lotteries_tabs) {
      if (data['lottery']['series_id'] === i['value']) {
        separator = i['encode_splitter'];
      }
    }
    this.is_visible_input = true;
    this.is_lodding_modal = false;
    this.code_value = '';
    let code_example = []
    this.input_number_obj = this.input_number_rule_obj[data.lottery_id];
    this.input_number_obj['obj'] = data;
    let code_length = this.input_number_obj['code_length'];
    for (var i = 1; i <= code_length; i++) {
      code_example.push(this.input_number_obj['valid_code'].split(',')[i] ? this.input_number_obj['valid_code'].split(',')[i] : this.input_number_obj['valid_code'].split(',')[0]);
    }
    if (separator === null) {
      separator = '';
    }
    this.code_rule = `    奖期号：${data.issue}
    彩种名称：${data.lottery_name}
    录号位数${code_length}位,${separator === '' ? '不用隔开' : '用英文“' + separator + '”隔开'}
    号码范围：${this.input_number_obj['valid_code']}
    例子: ${data['code_example']}
    `
    // 例子:${code_example.join(separator)}
  }
  /**
   * 关闭弹窗
   */
  close_drawer() {
    this.visible_modal = false;
    this.modal_lodding = false;
    this.update_form();
  }

  /**
*d刷新表单
*
* @memberof OperasyonActivityListComponent
*/
  update_form() {
    this.create_lottery_obj = {};
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }

  }
  /**
   * 获取奖期生成时间 
   */
  get_time_setting() {
    let option = {
      key: 'generate_issue_time'
    }
    this.gameService.sys_configure_value(option).subscribe((res: any) => {
      if (res && res.success) {

        this.every_day_time = res.data;

      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 点击编辑奖期生成时间
   */
  edit_lot_time() {

    this.is_visible_edit_time = true;
  }
  /**
 * 修改时间弹框点击取消
 */
  handleCancel() {
    this.is_visible_edit_time = false;
  }
  /**
   * 修改时间弹框点击确定
   */
  handleOk() {
    let option = {
      value: this.time.getHours() + ':' + (this.time.getMinutes() < 10 ? '0' + this.time.getMinutes() : this.time.getMinutes())
    }
    this.is_loading_edit_time = true;

    this.gameService.generate_issue_time(option).subscribe((res: any) => {
      this.is_visible_edit_time = false;
      this.is_loading_edit_time = false;
      if (res && res.success) {
        this.message.success('修改生成奖期时间成功', {
          nzDuration: 10000,
        });
        this.every_day_time = option.value;
        this.time = new Date();
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *生成奖期间
   *
   * @memberof GameLotteryIssueComponent
   */
  create_issue() {
    let start_time = Utils.change_date(this.create_lottery_obj['start_time'], 'date');
    let end_time = Utils.change_date(this.create_lottery_obj['end_time'], 'date');
    var option = {
      "lottery_id": this.create_lottery_obj['lottery_id'],
      "start_time": start_time,
      "end_time": end_time,
      "start_issue": '' ,
      'create_lottery_obj': '*'
    };
    this.modal_lodding = true;

    this.gameService.create_issue(option).subscribe((res: any) => {
      this.visible_modal = false;
      this.modal_lodding = false;
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
    this.choise_lottery = '0';
    this.previous_number = '0';
    this.search_number = null;
    this.search();
    if (this.lotteries_tabs[this.tab_index].value != 10086) {
      this.get_lotteries_list();
      // this.encode_splitter = this.lotteries_tabs[this.tab_index].encode_splitter === null ? '' : this.lotteries_tabs[this.tab_index].encode_splitter;
    }
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
        // for (let key in res.data) {
        //   this.lotteries_tabs.push({
        //     label: res.data[key],
        //     value: key
        //   }
        //   )
        // }
        this.encode_splitter = {};
        res.data.forEach((item, index) => {
          this.lotteries_tabs.push({
            label: item.title,
            value: item.series_name,
            status: item.status,
            encode_splitter: item.encode_splitter
          });
          this.encode_splitter[item.series_name] = item.encode_splitter ? item.encode_splitter : '';
        });

      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }



  /**
   * 搜索奖期
   */
  search_lotteries() {
    this.search();
  }

  /**
   * 获取当前系列的所有玩法
   */
  get_lotteries_list() {
    let data = {
      series_id: this.lotteries_tabs[this.tab_index].value
    }
    this.gameService.get_lotteries_list(data).subscribe((res: any) => {
      if (res && res.success) {
        this.lotteries_list = [];
        res.data.forEach((item) => {
          this.lotteries_list.push({
            title: item.cn_name,
            id: item.en_name
          })
        });
      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(page?): void {
    let option = {};//筛选条件

    if (this.search_number) {
      option['issue'] = this.search_number;
    }
    if (this.searchTime && this.searchTime.length > 0) {
      option['time_condtions'] = JSON.stringify([['end_time', '>=', parseInt(String(new Date(this.searchTime[0]).getTime()/1000))], ['end_time', '<=', parseInt(String(new Date(this.searchTime[1]).getTime()/1000))]])
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
      data.series_id = this.lotteries_tabs[this.tab_index].value;
    }
    if (this.choise_lottery && this.choise_lottery != '0') {
      data['lottery_id'] = this.choise_lottery;
    }
    if (this.previous_number && this.previous_number != '0') {
      data['previous_number'] = this.previous_number;
    }
    this.gameService.get_issue_list(page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index;
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_data = res.data;
        this.list_of_aply_data = [...this.list_of_data['data']];
        if (this.previous_number && this.previous_number != '0') {
          this.get_f5_time()

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
   * 获得下次刷新时间

   */
  get_f5_time() {
    let is_heve_open = false;
    this.up_time = this.list_of_aply_data[0].end_time;
    this.list_of_aply_data.forEach((item, index) => {
      if (item.official_code && !this.list_of_aply_data[index + 1].official_code) {
        this.up_time = this.list_of_aply_data[index + 1].end_time;
        is_heve_open = true;
      }
    });
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
