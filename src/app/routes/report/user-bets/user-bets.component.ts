import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { FormBuilder } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';
import { ToolService } from 'tool/tool.service';
import { Utils } from 'config/utils.config';
// import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-report-user-bets',
  templateUrl: './user-bets.component.html',
  styleUrls: ['./user-bets.component.less'],
})
export class ReportUserBetsComponent implements OnInit {
  //-----------条件筛选参数---------------
  // 搜索对象
  public searchData = {
    pageIndex: 1,
    pageSize: 15,
    username: '',
    is_tester: '',
    issue: '',
    status: '',
  };
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;
  public is_down_load: boolean;
  public show_text: string;
  constructor(
    private http: _HttpClient,
    private reportService: ReportService,
    public utilsService: ToolService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_userbet_list();

  }
  /**
 * 导出表格
 */
  public download_report() {
    let option: any = {};
    if (this.searchData.username) option.username = this.searchData.username;
    if (this.searchData.is_tester) option.is_tester = this.searchData.is_tester;
    if (this.searchData.status) option.status = this.searchData.status;
    if (this.searchData.issue) option.issue = this.searchData.issue;
    let data = [];
    this.is_down_load = true;
    this.reportService.get_user_bets_report(this.list_total, 1, option).subscribe((res: any) => {
      this.is_down_load = false;
      if (res && res.success) {
        res.data['data'].forEach((item) => {
          data.push({
            'ID': item.id,
            '用户名称': item.username,
            '奖期号': item.issue,
            '是否测试用户': item.is_tester,
            '开奖状态': item.status,
            '奖金组': item.bet_prize_group,
            '单注投注额': item.price,
            '倍数': item.times,
            '总投注额': item.total_cost,
            '单位': item.mode,
            '投注号码': item.bet_number,
            '开奖号码': item.open_number,
            '中奖金额': item.bonus,
            '系列': item.series_id,
            '彩种': item.lottery_sign,
            '玩法': item.method_sign,
            '玩法ID': item.method_name,
            'ip': item.ip,
            'ip层级': item.proxy_ip,
            '设备类型': item.bet_from,
          })
        });

        this.excelService.exportAsExcelFile(data, '玩家注单列表');

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })

  }


  /**
   *获取注单列表
   *
   * @param {*} page_index
   * @memberof OperasyonuserbetManageComponent
   */
  public get_userbet_list() {
    this.is_load_list = true;
    let option: any = {};
    if (this.searchData.username) option.username = this.searchData.username;
    if (this.searchData.is_tester) option.is_tester = this.searchData.is_tester;
    if (this.searchData.status) option.status = this.searchData.status;
    if (this.searchData.issue) option.issue = this.searchData.issue;
    this.reportService.get_user_bets_report(Utils.page_size, this.page_index, option).subscribe((res: any) => {
      if (res && res.success) {
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
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  public search(): void {
    this.page_index = 1;
    this.get_userbet_list();

  }
  /**
   * 重置搜索参数 
   * */
  public resetSearch() {
    this.reset_search_data();
    this.get_userbet_list();
  }
  /**
   * 重置搜索参数对象 
   * */
  public reset_search_data() {
    this.searchData = {
      pageIndex: 1,
      pageSize: 15,
      username: '',
      is_tester: '',
      issue: '',
      status: '',
    };
  }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  public chang_page_index(item) {
    this.page_index = item;
    this.get_userbet_list();
  }

}

