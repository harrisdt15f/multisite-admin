import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';

@Component({
  selector: 'app-report-account-report',
  templateUrl: './account-report.component.html',
  styleUrls: ['./account-report.component.less']
})
export class ReportAccountReportComponent implements OnInit {
  //-----------条件筛选参数
  public searchValue = '';
  public choise_deposit_mode: string;
  public choise_status: string;
  public in_out = [
    { text: '减少金额', value: '0' },
    { text: '增加金额', value: '1' }
  ]
  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public account_type_list: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;
  public is_down_load: boolean;
  public show_text: string;
  public account_type: string;


  constructor(
    private http: _HttpClient,
    private reportService: ReportService,
    private fb: FormBuilder,
    private excelService:ExcelService,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.search(1);
    this.get_account_type_list();
  }
  /**
   * 导出表格
   */
  download_report(){
    let option = {};//筛选条件
    if (this.choise_status && this.choise_status != '1000') {
      option['in_out'] = this.choise_status;
    }
    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    if(this.account_type&&this.account_type!=''){
      option['type_sign'] = this.account_type;
    }
    let data=[];
    this.is_down_load=true;
    this.reportService.get_account_report(this.list_total,1, option).subscribe((res: any) => {
      this.is_down_load=false;
      if (res && res.success) {
        res.data['data'].forEach((item)=>{
          data.push({
            '用户名称':item.username,
            '金额(元)':item.amount,
            '出入账类型':item.in_out===1?'增加金额':'减少金额',
            '账变类型':item.type_name,
            '创建时间':item.created_at
          })
        });
    
        this.excelService.exportAsExcelFile(data, '账变记录');

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })

  }
  /**
   * 筛选账变类型
   */
  account_type_change(e) {
    if (e == '1000') {
      this.account_type = '';

    } else {
      this.account_type = e;
    }
    this.search(1);

  }


  /**
   * 获取所有账变类型
   */
  get_account_type_list() {
    this.reportService.get_account_type().subscribe((res: any) => {
      if (res && res.success) {
        this.account_type_list = res.data
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })

  }


  /**
   *获取充值列表
   *
   * @param {*} page_index
   * @memberof OperasyonaccountManageComponent
   */
  get_account_list(page_index, data?) {
    this.is_load_list = true;
    this.reportService.get_account_report('20',page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_aply_data = res.data['data'];

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
   *筛选充值类型
   *
   * @param {*} value
   * @memberof OperasyonaccountManageComponent
   */

  filter_status_change(value) {
    this.choise_status = value;
    this.search();
  }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(page?): void {
    let option = {};//筛选条件

    if (this.choise_status && this.choise_status != '1000') {
      option['in_out'] = this.choise_status;
    }
    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    if(this.account_type&&this.account_type!=''){
      option['type_sign'] = this.account_type;
    }

    this.get_account_list(page ? page : 1, option);

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

}
