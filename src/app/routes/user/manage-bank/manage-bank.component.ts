import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-manage-bank',
  templateUrl: './manage-bank.component.html',
  styleUrls: ['manage-bank.component.less']
})
export class ManageBankComponent implements OnInit {
  public pages = {
    page_size: 20,
    page: 1,
    total: 0
  }
  public listData = {
    bank_name: null,
    branch: null,
    username: null,
    owner_name: null,
    card_number: null,
    bank_sign: null,
    status: null
  }
  public searchs = {
    show: true
  }
  public dataList = [];
  public dataLoading = false;

  constructor(
    public Api: ApiService
  ) { }

  ngOnInit() {
    // 获取列表
    this.getList();
  }

  // 获取列表
  public getList() {
    this.Api.noticeDetail(this.pages).subscribe((response: any) => {
      if (response && response['success']) {
        this.pages.total = response['data']['total'];
        this.dataList = response['data']['data'];
      }
    })
  }

  // 页数改变时
  public changPage() {
    this.getList();
  }

  // 搜索
  public search() {
    let data = {
      page_size: this.pages.page_size,
      page: this.pages.page,
      total: this.pages.total
    }
    for(const k of Object.keys(this.listData)) {
      if (this.listData[k]) {
        data[k] = this.listData[k];
      }
    }
    this.Api.noticeDetail(data).subscribe((response: any) => {
      if (response && response['success']) {
        this.pages.total = response['data']['total'];
        this.dataList = response['data']['data'];
      }
    })
  }
  // 取消搜索
  reset() {
    this.listData = {
      bank_name: null,
      branch: null,
      username: null,
      owner_name: null,
      card_number: null,
      bank_sign: null,
      status: null
    }
  }
}
