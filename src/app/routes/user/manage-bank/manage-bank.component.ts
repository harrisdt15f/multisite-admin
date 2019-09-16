import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-manage-bank',
  templateUrl: './manage-bank.component.html',
  styleUrls: ['manage-bank.component.less']
})
export class ManageBankComponent implements OnInit {
  // 搜索对象

  public pages = {
    page_size: 20,
    dataLoading: false,
    page: 1,
    total: 0
  };
  public listData = {
    bank_name: null,
    branch: null,
    username: null,
    owner_name: null,
    card_number: null,
    bank_sign: null,
    status: '1'
  };
  public searchs = {
    show: true
  };
  public dataList = [];


  constructor(
    public Api: ApiService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    // 获取列表
    this.search();
  }
  /**
 * 删除银行卡
 */
  delete_banck(item) {
    let option = {
      id: item.id
    };
    this.Api.deleteBank(option).subscribe((response: any) => {
      if (response && response['success']) {
        this.message.success('删除银行卡成功！', {
          nzDuration: 10000,
        });
        this.search();
      }
    });
  }

  // 获取列表
  public getList(data) {

    this.Api.noticeDetail(data).subscribe((response: any) => {
      this.pages.dataLoading = false;
      if (response && response['success']) {
        this.pages.total = response['data']['total'];
        this.dataList = response['data']['data'];
      }
    });
  }

  // 页数改变时
  public changPage(item) {
    this.pages.page = item;
    this.search();
  }

  // 搜索
  public search() {
    let data = {
      page_size: this.pages.page_size,
      page: this.pages.page,
      total: this.pages.total
    };
    for (const k of Object.keys(this.listData)) {
      if (this.listData[k]) {
        data[k] = this.listData[k];
      }
    }
    this.pages.dataLoading = true;
    this.getList(data);
  }
  research() {
    this.pages.page = 1;
    this.search();
  }
  // 取消搜索
  reset() {
    this.pages.page = 1;
    this.listData = {
      bank_name: null,
      branch: null,
      username: null,
      owner_name: null,
      card_number: null,
      bank_sign: null,
      status: '1'
    };
    this.search();
  }
}
