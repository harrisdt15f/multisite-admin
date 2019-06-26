import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

import { FormBuilder } from '@angular/forms';
import { ReportService } from 'app/service/report.service';
import { ExcelService } from 'app/service/excel.service';

@Component({
  selector: 'app-report-user-bets',
  templateUrl: './user-bets.component.html',
  styleUrls: ['./user-bets.component.less'],
})
export class ReportUserBetsComponent implements OnInit {
  //-----------条件筛选参数
  public searchValue = '';
  public search_issue = '';
  public search_is_tester: string;
  public choise_status: string;
  public is_tester = [
    { text: '是', value: '1' },
    { text: '否', value: '0' }

  ];
  public status = [
    { text: '待开奖', value: '0' },
    { text: '已撤销', value: '1' },
    { text: '未中奖', value: '2' },
    { text: '已中奖', value: '3' },
    { text: '已派奖', value: '4' },

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
    if (this.is_tester && Number(this.is_tester) != 1000) {
      option['is_tester'] = this.is_tester;
    }
    if (this.choise_status && this.choise_status != '1000') {
      option['status'] = this.choise_status;
    }
    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    if (this.search_issue) {
      option['company_order_num'] = this.search_issue;
    }
    let data=[];
    this.is_down_load=true;
    this.reportService.get_user_bets_report(this.list_total,1, option).subscribe((res: any) => {
      this.is_down_load=false;
      if (res && res.success) {
        res.data['data'].forEach((item)=>{
          data.push({
            '用户名称':item.username,
            '奖期号':item.issue,
            '是否测试用户':item.is_tester,
            '开奖状态':item.status,
            '奖金组':item.bet_prize_group,
            '单注投注额':item.price,
            '倍数':item.times,
            '总投注额':item.total_cost,
            '单位':item.mode,
            '投注号码':item.bet_number,
            '开奖号码':item.open_number,
            '中奖金额':item.bonus,
            '系列':item.series_id,
            '彩种':item.lottery_sign,
            '玩法':item.method_sign,
            '玩法ID':item.method_name,
            'ip':item.ip,
            'ip层级':item.proxy_ip,
            '设备类型':item.bet_from,
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
   *获取充值列表
   *
   * @param {*} page_index
   * @memberof OperasyonrechargeManageComponent
   */
  get_recharge_list(page_index, data?) {
    this.is_load_list = true;
    this.reportService.get_user_bets_report('20',page_index, data).subscribe((res: any) => {
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
    this.search_issue = '';
    this.search();
  }
  /**
   *筛选充值类型
   *
   * @param {*} value
   * @memberof OperasyonrechargeManageComponent
   */
  filter_deposit_mode_change(value) {
    this.search_is_tester = value;
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
    if (this.search_is_tester && Number(this.search_is_tester) != 1000) {
      option['is_tester'] = this.search_is_tester;
    }
    if (this.choise_status && this.choise_status != '1000') {
      option['status'] = this.choise_status;
    }
    if (this.searchValue) {
      option['username'] = this.searchValue;
    }
    if (this.search_issue) {
      option['issue'] = this.search_issue;
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

