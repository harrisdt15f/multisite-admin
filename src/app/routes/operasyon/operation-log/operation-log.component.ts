import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { startOfMonth } from 'date-fns';
@Component({
  selector: 'app-log-operation-log',
  templateUrl: './operation-log.component.html',
  styleUrls: ['./operation-log.component.less']
})
export class LogOperationLogComponent implements OnInit {
  //----------------筛选相关
  public ranges1 = {
    "今日": [new Date(), new Date()],
    '本月': [startOfMonth(new Date()), new Date()]
  };
  public modal_type: string;
  public is_visible_city: boolean;
  public start_time: string;
  public end_time: string;
  public search_origin: string;
  public search_ip_ad: string;
  public search_admin_name: string;
  public search_os: string;
  // public searchValue = '';
  //----------内容

  public page_index = 1;
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  // public widthConfig = ['100px', '200px', '200px', '100px', '100px', '200px', '200px', '100px', '200px', '200px', '100px', '100px', '200px', '200px', '100px', '200px', '100px'];

  public is_load_list: boolean;
  public if_show_text: boolean;
  public show_text: string;
  public city_obj: object = {};

  // public sortName: string | null = null;
  // public sortValue: string | null = null;
  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.search();
  }

  /**
 * 查询ip所在地
 */
  search_ip(ip) {
    this.is_visible_city = true;

    this.userManageService.search_city_by_ip(ip).subscribe((res: any) => {
      if (res && res.success) {
        this.city_obj = res.data;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *时间组件改变
   *
   * @param {Date[]} result
   * @memberof LogOperationLogComponent
   */
  on_change_time(result: Date[]): void {
    if (result.length == 0) {
      this.start_time = '';
      this.end_time = '';
    } else {
      this.start_time = this.change_date(result[0], 'start');
      this.end_time = this.change_date(result[1], 'end');

    }

    this.search();

  }
  /**
   * GmT转时间格式 
   * */
  change_date(time, type) {
    let date = new Date(time);
    let mouth = (date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let Str = date.getFullYear() + '-' + mouth + '-' + day + ' ';
    return type == 'start' ? Str + '00:00:00' : Str + '23:59:59'
  }

  /**
   * 点击列表项展示详情
   */
  show_content(data, type) {
    this.if_show_text = true;
    if (type == 'object') {
      let value = JSON.parse(data);
      this.show_text = JSON.stringify(value, undefined, 2);
    } else {
      this.show_text = data;
    }
  }


  /**
   *取消搜索
   *
   * @memberof UserPassportCheckComponent
   */
  reset(type?): void {
    switch (type) {
      case 'origin':
        this.search_origin = '';
        break;
      case 'ip':
        this.search_ip_ad = '';
        break;
      case 'name':
        this.search_admin_name = '';
        break;
      case 'os':
        this.search_os = '';
        break;
    }
    this.search();
  }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  search(page?): void {
    let option = {};//筛选条件


    if (this.search_origin) {
      option['origin'] = this.search_origin;
    }
    if (this.search_ip_ad) {
      option['ip'] = this.search_ip_ad;
    }
    if (this.search_admin_name) {
      option['admin_name'] = this.search_admin_name;
    }
    if (this.search_os) {
      option['os'] = this.search_os;
    }
    if (this.start_time) {
      option['start_time'] = this.start_time;
    }
    if (this.end_time) {
      option['end_time'] = this.end_time;
    }

    this.get_log_list(page ? page : 1, option);

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
  /*
  *
  *获取用户管理列表
  *
  * @memberof UserManageUserComponent
  */
  get_log_list(page_index, option?) {
    this.is_load_list = true;
    this.userManageService.get_log_list(page_index, option).subscribe((res: any) => {
      if (res && res.success) {
        this.list_total = res.data.total;
        this.is_load_list = false;
        this.list_of_aply_data = res.data['data'];
        // this.list_of_aply_data.forEach((item)=>{
        //   this.userManageService.get_country_by_ip(item.ip).subscribe((res: any) => {

        //   });
        // });

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

}
