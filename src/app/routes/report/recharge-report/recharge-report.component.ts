import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';

@Component({
  selector: 'app-report-recharge-report',
  templateUrl: './recharge-report.component.html',
  styleUrls:['./recharge-report.component.less']
})
export class ReportRechargeReportComponent implements OnInit {

  //-----------条件筛选参数
  public searchValue = '';
  public search_company_order_num = '';
  public choise_deposit_mode: string;
  public choise_status: string;
  public deposit_mode = [
    { text: '人工充值', value: '1' },
    { text: '自动充值', value: '0' }

  ];
  public status = [
    { text: '正在充值', value: '0' },
    { text: '充值成功', value: '1' },
    { text: '充值失败', value: '2' },
    { text: '待审核', value: '10' },
    { text: '审核通过', value: '11' },
    { text: '审核核拒绝', value: '12' },
  ]



  html: string;
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
    private excelService:ExcelService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {

    this.search(1);
  }
    /**
   * 导出表格
   */
  download_report(){
    let option = {};//筛选条件
    if (this.choise_deposit_mode && Number(this.choise_deposit_mode) != 1000) {
      option['deposit_mode'] = this.choise_deposit_mode;
    }
    if (this.choise_status && this.choise_status != '1000') {
      option['status'] = this.choise_status;
    }
    if (this.searchValue) {
      option['user_name'] = this.searchValue;
    }
    if (this.search_company_order_num) {
      option['company_order_num'] = this.search_company_order_num;
    }
    let data=[];
    this.is_down_load=true;
    this.reportService.get_recharge_report(this.list_total,1, option).subscribe((res: any) => {
      this.is_down_load=false;
      if (res && res.success) {
        res.data['data'].forEach((item)=>{
          data.push({
            '用户名称':item.user_name,
            '平台订单号':item.company_order_num,
            '金额(元)':item.amount,
            '充值类型':item.deposit_mode===1?'人工充值':'自动充值',
            '充值状态':this.reportService.transform(item.status),
            '创建时间':item.created_at,
            '更新时间':item.updated_at,
          })
        });
    
        this.excelService.exportAsExcelFile(data, '充值记录');

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
   * @memberof OperasyonrechargeManageComponent
   */
  get_recharge_list(page_index, data?) {
    this.is_load_list = true;
    this.reportService.get_recharge_report('20',page_index, data).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index
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
   *取消搜索
   *
   * @memberof UserPassportCheckComponent
   */
  reset(): void {
    this.searchValue = '';
    this.search();
  }
    /**
   *取消订单号
   *
   * @memberof UserPassportCheckComponent
   */
  reset_num(): void {
    this.search_company_order_num = '';
    this.search();
  }
  /**
   *筛选充值类型
   *
   * @param {*} value
   * @memberof OperasyonrechargeManageComponent
   */
  filter_deposit_mode_change(value) {
    this.choise_deposit_mode = value;
    this.search();
  }
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
    if (this.choise_deposit_mode && Number(this.choise_deposit_mode) != 1000) {
      option['deposit_mode'] = this.choise_deposit_mode;
    }
    if (this.choise_status && this.choise_status != '1000') {
      option['status'] = this.choise_status;
    }
    if (this.searchValue) {
      option['user_name'] = this.searchValue;
    }
    if (this.search_company_order_num) {
      option['company_order_num'] = this.search_company_order_num;
    }
    this.get_recharge_list(page ? page : 1, option);

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


