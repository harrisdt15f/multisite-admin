import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';
import { ToolService } from 'tool/tool.service';
import { Utils } from 'config/utils.config';
import { CommonService } from 'app/service/common.service';
import { type } from 'os';
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
    pageSize: '100',
    username: '',
    get_sub: false,
    serial_number: '',
    end_time: '',
    start_time: '',
    time_condtions: '',
    lottery_sign: '',
    method_sign: '',
    ip: '',
    mode: '',
    times: '',
    is_tester: '',
    issue: '',
    status: '',
  };
  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public LotteriesOptions: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;
  public show_text: string;
    // -------导出报表参数
    public logList: Array<any> = [];
    public is_down_load: boolean;
    public is_down_load_all: boolean;
    public nowOption = {};
  constructor(
    private http: _HttpClient,
    private reportService: ReportService,
    public utilsService: ToolService,
    public commonService: CommonService,
    private modalService: NzModalService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_userbet_list();
    this.getAllLotteries();
  }

  /**
   *
   *
   * @param {Date} result
   * @memberof ReportUserBetsComponent
   */
  onChange(result: Date): void {
    this.searchData.start_time = Utils.change_date(result[0], 'time');
    this.searchData.end_time = Utils.change_date(result[1], 'time');
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
    if (this.searchData.username) {
      option.username = this.searchData.username;
      option.get_sub = this.searchData.get_sub ? 1 : 0;
    }
    if (this.searchData.is_tester) option.is_tester = this.searchData.is_tester;
    if (this.searchData.status) option.status = this.searchData.status;
    if (this.searchData.issue) option.issue = this.searchData.issue;
    if (this.searchData.mode) option.mode = this.searchData.mode;
    if (this.searchData.times) option.times = this.searchData.times;
    if (this.searchData.ip) option.ip = this.searchData.ip;
    if (this.searchData.lottery_sign && this.searchData.lottery_sign.length > 0) {
      option.lottery_sign = this.searchData.lottery_sign[1];
    }
    if (this.searchData.serial_number) option.serial_number = this.searchData.serial_number;
    if (this.searchData.start_time && this.searchData.end_time) {
      option.time_condtions = Utils.getTimeString(this.searchData.start_time, this.searchData.end_time);
    }
    this.nowOption = option;
    this.reportService.get_user_bets_report(this.searchData.pageSize, this.page_index, option).subscribe((res: any) => {
      if (res && res.success) {
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_aply_data = res.data.data;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }
  /**
   * 获取彩种列表
   */
  public getAllLotteries() {
    this.commonService.getAllLotteriesList().subscribe((res: any) => {
      if (res && res.success) {
        this.LotteriesOptions = [];
        res.data.forEach((item: any) => {
          var arr: any = Object.keys(item);
          let value: string = arr[0];
          let label = arr[1];
          let obj: any = {
            value: item[value],
            label: (typeof item[label] === 'string') ? item[label] : item[value]
          };
          if (item.list) {
            obj.children = [];
            item.list.forEach((data) => {
              obj.children.push({
                value: data.en_name,
                label: data.cn_name,
                isLeaf: true
              });
            });
          }
          this.LotteriesOptions.push(obj);
        });

      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }
  /**
   * 更高采种选项
   */
  onChanges() {

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
      pageSize: '100',
      username: '',
      end_time: '',
      start_time: '',
      times: '',
      get_sub: false,
      serial_number: '',
      time_condtions: '',
      lottery_sign: '',
      method_sign: '',
      ip: '',
      mode: '',
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

 /**
 * 导出表格
 */
download_report() {
  this.logList = [];
  this.pushLogList(this.list_of_aply_data);
  this.excelService.exportAsExcelFile(this.logList, '玩家注单报表');
}
/**
*点击导出所有
*
* @memberof PlayerListComponent
*/
public download_report_all() {
  let page_number = Math.ceil(Number(this.list_total) / Number(this.searchData.pageSize));
  this.logList = [];
  this.is_down_load_all = true;
  this.report_list(1, page_number);
}
/**
 循环便利导出所有
 *
 * @param {*} now_page
 * @param {*} total_page
 * @memberof PlayerListComponent
 */
report_list(now_page, total_page) {
  this.submit_list_service(this.nowOption, (page) => {
    if (page < total_page) {
      this.message.create('success', `成功导出第 ${page} 页，共${total_page}页！`);
      this.report_list(page + 1, total_page);
    } else {
      setTimeout(() => {
        this.is_down_load_all = false;
        const modal = this.modalService.success({
          nzTitle: '温馨提示',
          nzContent: '导出成功 !'
        });
      }, 1000);
      this.excelService.exportAsExcelFile(this.logList, '用户报表');
    }
  }, now_page);

}
/*
*调用查询并回调
*
* @param {*} option
* @param {*} callback
* @param {*} [now_page]
* @memberof PlayerListComponent
*/
public submit_list_service(option, callback, now_page?) {
  this.reportService.get_user_bets_report(this.searchData.pageSize, now_page, option).subscribe((res: any) => {
    if (res && res.success) {
      this.pushLogList(res.data['data']);
      callback(now_page);
    } else {
      this.message.error(res.message, {
        nzDuration: 10000,
      });
    }
  });
}

/**
 *获取数据push给打印数组
 *
 * @param {*} data_list
 * @memberof ReportRechargeReportComponent
 */
pushLogList(data_list) {
  data_list.forEach((item) => {
    this.logList.push({
      '注单编号': item.serial_number,
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
    });
  });
}
}

