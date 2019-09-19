import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';
import { Utils } from 'config/utils.config';
import { ToolService } from 'tool/tool.service';


@Component({
  selector: 'app-report-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.less']
})
export class ReportAccountReportComponent implements OnInit {
  // 搜索对象
  public searchData = {
    pageIndex: 1,
    pageSize: '100',
    id: '',
    is_tester: '',
    ip: '',
    mode: '',
    get_sub: 0,
    username: '',
    in_out: '',
    type_sign: ''
  };
  //-----------条件筛选参数
  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public type_sign_list: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;

  // -------导出报表参数
  public logList: Array<any> = [];
  public is_down_load: boolean;
  public is_down_load_all: boolean;
  public nowOption = {};

  // ------列表弹框
  public check_data_list = {};
  public check_data_pop: boolean;

  constructor(
    private http: _HttpClient,
    private reportService: ReportService,
    private modalService: NzModalService,
    public utilsService: ToolService,
    private fb: FormBuilder,
    private excelService: ExcelService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_type_sign_list();
    this.get_account_list();
  }
  /**
   * 重置搜做参数
   */
  resetSearch() {
    this.reset_search_data();
    this.page_index = 1;
    this.get_account_list();
  }
  /**
   * 重置搜索表单
   */
  public reset_search_data() {
    this.searchData = {
      get_sub: 0,
      pageIndex: 1,
      pageSize: '100',
      id: '',
      is_tester: '',
      mode: '',
      ip: '',
      username: '',
      in_out: '',
      type_sign: ''
    };
  }
 

  /**
   * 获取所有账变类型
   */
  get_type_sign_list() {
    this.reportService.get_account_type().subscribe((res: any) => {
      if (res && res.success) {
        this.type_sign_list = res.data
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
  }

  /**
   *获取充值列表
   *
   * @param {*} page_index
   * @memberof OperasyonaccountManageComponent
   */
  get_account_list() {
    this.is_load_list = true;
    let option: any = {};
    if (this.searchData.username) option.username = this.searchData.username;
    if (this.searchData.type_sign) option.type_sign = this.searchData.type_sign;
    if (this.searchData.in_out) option.in_out = Number(this.searchData.in_out);
    if (this.searchData.ip) option.ip = this.searchData.ip;
    if (this.searchData.mode) option.mode = this.searchData.mode;
    if (this.searchData.is_tester) option.is_tester = this.searchData.is_tester;
    option.get_sub = this.searchData.get_sub ? 1 : 0;
    this.nowOption = option;
    this.reportService.get_account_report(this.searchData.pageSize, this.page_index, option).subscribe((res: any) => {
      if (res && res.success) {
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_aply_data = res.data['data'];
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
    this.get_account_list();
  }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    this.page_index = item;
    this.get_account_list();
  }

/**
 * 导出表格
 */
download_report() {
  this.logList = [];
  this.pushLogList(this.list_of_aply_data);
  this.excelService.exportAsExcelFile(this.logList, '玩家账变报表');
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
  this.reportService.get_account_report(this.searchData.pageSize, now_page, option).subscribe((res: any) => {
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
 * 查看详细信息
 * @param data_list 
 */
check_data(data){
  this.check_data_pop = true;
  this.check_data_list = data;
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
      '用户名称': item['username'],
      '金额(元)': item['amount'],
      '余额(元)': item['balance'],
      '出入账类型': item.in_out === 1 ? '增加金额' : '减少金额',
      '账变类型': item['type_name'],
      '创建时间': item['created_at']
    });
  });
}
}


