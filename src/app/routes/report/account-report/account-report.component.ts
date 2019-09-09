import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';
import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-report-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.less']
})
export class ReportAccountReportComponent implements OnInit {
  // 搜索对象
  public searchData = {
    pageIndex: 1,
    pageSize: 15,
    id: '',
    is_tester: '',
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
  public is_down_load: boolean;




  constructor(
    private http: _HttpClient,
    private reportService: ReportService,
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
      pageIndex: 1,
      pageSize: 15,
      id: '',
      is_tester: '',
      username: '',
      in_out: '',
      type_sign: ''
    };
  }
  /**
   * 导出表格
   */
  download_report() {
    let option = {};//筛选条件
    // if (this.choise_status && this.choise_status != '1000') {
    //   option['in_out'] = this.choise_status;
    // }
    // if (this.searchValue) {
    //   option['username'] = this.searchValue;
    // }
    // if(this.type_sign&&this.type_sign!=''&&this.type_sign!='1000'){
    //   option['type_sign'] = this.type_sign;
    // }
    let data = [];
    this.is_down_load = true;
    this.reportService.get_account_report(this.list_total, 1, option).subscribe((res: any) => {
      this.is_down_load = false;
      if (res && res.success) {
        res.data['data'].forEach((item) => {
          data.push({
            '用户名称': item.username,
            '金额(元)': item.amount,
            '出入账类型': item.in_out === 1 ? '增加金额' : '减少金额',
            '账变类型': item.type_name,
            '创建时间': item.created_at
          });
        });
        this.excelService.exportAsExcelFile(data, '账变记录');
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });

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
    if (this.searchData.in_out) option.in_out = this.searchData.in_out;
    this.reportService.get_account_report(Utils.page_size, this.page_index, option).subscribe((res: any) => {
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

}
