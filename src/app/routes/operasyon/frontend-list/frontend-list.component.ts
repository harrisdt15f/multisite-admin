import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { startOfMonth } from 'date-fns';
@Component({
  selector: 'app-operasyon-frontend-list',
  templateUrl: './frontend-list.component.html',
  styleUrls:['./frontend-list.component.less']
})
export class OperasyonFrontendListComponent implements OnInit {

    //----------------筛选相关
    public ranges1 = { 
      "今日": [new Date(), new Date()], 
      '本月': [startOfMonth(new Date()),new Date()] 
    };
    public modal_type: string;
    public start_time: string;
    public end_time: string;
    // public searchValue = '';
    //----------内容
  
    public page_index = 1;
    public list_of_aply_data: Array<any> = [];
    public list_total: number;
    // public widthConfig = ['100px', '200px', '200px', '100px', '100px', '200px', '200px', '100px', '200px', '200px', '100px', '100px', '200px', '200px', '100px', '200px', '100px'];
  
    public is_load_list: boolean;
    public if_show_text: boolean;
    public show_text: string;
  
    // public sortName: string | null = null;
    // public sortValue: string | null = null;
    constructor(
      private http: _HttpClient,
      private userManageService: UserManageService,
      private message: NzMessageService
    ) { }
  
    ngOnInit() {
      this.search();
      this.get_list();
    }

        /*
  *
  *获取用户管理列表
  *
  * @memberof UserManageUserComponent
  */
 get_list() {
  this.is_load_list = true;
  this.userManageService.get_ip_list().subscribe((res: any) => {
    if (res && res.success) {



    } else {
      this.is_load_list = false;
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
      }else{
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
    show_content(data,type){
      this.if_show_text=true;
      if(type == 'object'){
        let value=JSON.parse(data);
        this.show_text=JSON.stringify(value, undefined, 2);
      }else{
       this.show_text=data;
      }
    }
  
  
    /**
     *取消搜索
     *
     * @memberof UserPassportCheckComponent
     */
    //  reset(): void {
    //   this.reset = '';
    //   this.search();
    // }
    /**
     *搜索数组
     *
     * @memberof UserPassportCheckComponent
     */
    search(page?): void {
      let option = {};//筛选条件
  
      // if (this.list_of_search_group && this.list_of_search_group != '1000') {
      //   option['type'] = this.list_of_search_group;
      // }
      // if (this.searchValue) {
      //   option['username'] = this.searchValue;
      // }
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
    get_log_list(page_index,option?) {
      this.is_load_list = true;
      this.userManageService.get_frontend_log_list(page_index,option).subscribe((res: any) => {
        if (res && res.success) {
          this.list_total = res.data.total;
          this.is_load_list = false;
          this.list_of_aply_data = res.data['data'];
 
  
        } else {
          this.is_load_list = false;
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }
  
  }
  