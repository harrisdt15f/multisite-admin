import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { settings } from 'cluster';

@Component({
  selector: 'app-operasyon-category-manage',
  templateUrl: './category-manage.component.html',
  styleUrls: ['./category-manage.component.less']
})
export class OperasyonCategoryManageComponent implements OnInit {

  public page_index = 1;
  public list_of_data: Array<any> = [];
  public list_total: number;
  public is_load_list: boolean;



  mapOfExpandData: { [key: string]: boolean } = {};
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private userManageService: UserManageService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.get_system_setting_list();

  }

  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    // this.get_system_setting_list();
  }
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  get_system_setting_list() {
    this.is_load_list = true;
    this.userManageService.get_category_manage_list().subscribe((res: any) => {
      if (res && res.success) {
        this.is_load_list = false;
        this.list_of_data = res.data;

      } else {
        this.is_load_list = false;
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }


}

