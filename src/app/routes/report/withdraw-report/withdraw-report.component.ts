import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';

import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-report-withdraw-report',
  templateUrl: './withdraw-report.component.html',
  styleUrls: ['./withdraw-report.component.less']
})
export class ReportWithdrawReportComponent implements OnInit {
  public searchData = {
    pageIndex: 1,
    pageSize: '100',
    username: '',
    time_condtions: '',
    status: '',
    order_id: ''
  };
  // -----------条件筛选参数

  html: string;
  public nowOption: any = {};
  // tslint:disable-next-line: variable-name
  public is_load_list: boolean;
  public list_total: number;
  // tslint:disable-next-line: variable-name
  public list_of_withdraw_data: any = {};
  public is_down_load_all: boolean;
  public logList: any = [];

  public page_index = 1;
  public show_text: string;
  // -------导出报表参数
  public is_down_load: boolean;

  constructor(
    private reportService: ReportService,
    private excelService: ExcelService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private newHttp: ApiService
  ) { }

  ngOnInit() {
    this.search();
  }

  /**
   * 重置搜索参数 
   * */
  public resetSearch() {
    this.reset_search_data();
    this.get_withdraw_list();
  }
  /**
   * 重置搜索参数对象 
   * */
  public reset_search_data() {
    this.searchData = {
      pageIndex: 1,
      pageSize: '100',
      username: '',
      time_condtions: '',
      status: '',
      order_id: ''
    };
  }

  /**
   *获取充值列表
   *
   * @param {*} page_index
   * @memberof OperasyonrechargeManageComponent
   */
  get_withdraw_list() {
    this.is_load_list = true;
    const option: any = {};
    const { searchData } = this;
    for (const key in searchData) {
      if ( searchData[key] !== '' ) {
        option[key] = searchData[key];
      }
    }
    this.nowOption = option;
    const url = '/api/reportManagement/withdraw-record';
    this.reportService.get_report(url, this.searchData.pageSize, this.page_index, option).subscribe((res: any) => {
      if (res && res.success) {
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_withdraw_data = res.data.data;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }

  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(): void {
    this.page_index = 1;
    this.get_withdraw_list();
  }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    this.page_index = item;
    this.get_withdraw_list();
  }

    /**
 * 导出表格
 */
download_report() {
  this.logList = [];
  this.pushLogList(this.list_of_withdraw_data);
  this.excelService.exportAsExcelFile(this.logList, '提现记录');
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
      this.excelService.exportAsExcelFile(this.logList, '用户提现报表');
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
  this.reportService.get_recharge_report(this.searchData.pageSize, now_page, option).subscribe((res: any) => {
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
      '用户名称': item.username,
      '提现申请时间': item.time_condtions,
      '状态': item.status,
      '编号': item.order_id
    });
  });
}

}


