import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../api/api.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Utils } from 'config/utils.config';

@Component({
  selector: 'app-lottery-series',
  templateUrl: './lottery-series.component.html',
  styleUrls: ['./lottery-series.component.less']
})
export class LotterySeriesComponent implements OnInit {
  // 分页设置
  public pages = {
    page_size: 200,
    page: 1,
    total: 0
  }

  // 数据列表
  public dataList = [];
  public dataLoading = false;
  // 添加 编辑开关
  public is_show_modal = false;
  public modal_type = 0;
  // 传值
  public lotterySeries = {
    title: '',
    series_name: '',
    encode_splitter: null,
    price_difference: 0,
    status: 1
  }
  // 验证
  public create_form_lottery = null;

  constructor(
    public Api: ApiService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
      // 获取列表
    this.getList();

  }

  public priceNumber() {
    this.lotterySeries['price_difference'] = Utils.number(this.lotterySeries['price_difference']);
  }
    // 提交 修改 创建
  public deleteList(item: any) {
    let data = {
      id: item['id']
    }
    this.Api.lotterySeriesDelete(data).subscribe((response: any) => {
      if (response && response['success']) {
        this.message.success('删除成功', {
          nzDuration: 3000,
        });
        this.getList();
      }
    })
  }
  // 提交 修改 创建
  public submit() {
    if(this.lotterySeries['encode_splitter'] === 'null') {
      this.lotterySeries['encode_splitter'] = null;
    } else if(this.lotterySeries['encode_splitter'] === ' ') {
      this.lotterySeries['encode_splitter'] = 'space';
    }
    if (!this.modal_type) {
      this.Api.lotterySeriesAdd(this.lotterySeries).subscribe((response: any) => {
        if (response && response['success']) {
          this.message.success('创建成功', {
            nzDuration: 3000,
          });
          this.getList();
          this.is_show_modal = false;
        }
      })
    } else {
      this.Api.lotterySeriesEdit(this.lotterySeries).subscribe((response: any) => {
        if (response && response['success']) {
          this.message.success('编辑成功', {
            nzDuration: 3000,
          });
          this.getList();
          this.is_show_modal = false;
        }
      })
    }
  }
 // 获取列表
 public getList() {
  this.Api.lotterySeriesList(this.pages).subscribe((response: any) => {
      if (response && response['success']) {
        let data = response['data'];
        let temp = [];
        this.pages.total = 100;
        for(let k of Object.keys(data)) {
          temp.push(data[k]);
        }
        this.dataList = temp;
      }
    })
  }
  // 页数改变时
  public changPage() {
    this.getList();
  }
  // 添加彩种
  public add_lottery(type: any, item: any = null) {
    this.is_show_modal = true;
    this.modal_type = type;
    if (!item) {
      this.lotterySeries = {
        title: '',
        series_name: '',
        encode_splitter: null,
        price_difference: 0,
        status: 1
      }
    } else {
      this.lotterySeries['id'] = item['id']
      this.lotterySeries['title'] = item['title']
      this.lotterySeries['series_name'] = item['series_name']
      this.lotterySeries['encode_splitter'] = null
      this.lotterySeries['price_difference'] = item['price_difference'] ? item['price_difference'] : 0
      this.lotterySeries['status'] = item['status']
    }

  }
}
