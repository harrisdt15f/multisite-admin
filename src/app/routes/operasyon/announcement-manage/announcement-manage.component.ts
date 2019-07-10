import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UEditorComponent } from 'ngx-ueditor';
import { until } from 'protractor';
import { Utils } from 'config/utils.config';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
declare let window:any;
@Component({
  selector: 'app-operasyon-announcement-manage',
  templateUrl: './announcement-manage.component.html',
  styleUrls: ['./announcement-manage.component.less'],
})
export class OperasyonAnnouncementManageComponent implements OnInit {
  @ViewChild('full')
  full: UEditorComponent;
  html: string;
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  // public widthConfig = ['100px', '200px', '200px', '100px', '100px', '200px', '200px', '100px', '200px', '200px', '100px', '100px', '200px', '200px', '100px', '200px', '100px'];

  public is_load_list: boolean;

  public show_text: string;
  // public searchValue = '';
  // public sortName: string | null = null;
  // public sortValue: string | null = null;
  //--------------弹框参数
  public if_show_modal: boolean;
  public modal_type: string = '®create';
  public create_form: FormGroup;//表单对象
  public modal_lodding: boolean;//显示加载图标
  public edit_announcement_obj: object = {
    content: ''
  };//显示加载图标
  public announcement_type_list: Array<any> = [
    {
      title:'平台公告',
      id:1
    },
    {
      title:'站内信公告',
      id:2
    }
  ];//公告分类列表
  public html_content: string = '';
  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.create_form = this.fb.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      type: [null],
      start_time: [null, [Validators.required]],
      status: [null, [Validators.required]],
      end_time: [null, [Validators.required]]
    });
    this.get_announcement_type();
    this.get_announcement_list(1);
  }
  /**
   *提交
   *
   * @memberof OperasyonannouncementManageComponent
   */
  submit_activity() {
    let option = {
      id: this.edit_announcement_obj['id'],
      title: this.edit_announcement_obj['title'],
      status: this.edit_announcement_obj['status'],
      type:this.edit_announcement_obj['type']
    };

    let img_obj = Utils.get_img_iri(this.edit_announcement_obj['content'], 'remove');
    option['content'] = img_obj.content;
    if (img_obj.pic_path.length > 0 && img_obj.pic_name.length > 0) {
      option['pic_path'] = img_obj.pic_path;
      option['pic_name'] = img_obj.pic_name;
    }
    if (this.edit_announcement_obj['start_time']) {
      option['start_time'] = Utils.change_date(this.edit_announcement_obj['start_time'], 'time');
    }
    if (this.edit_announcement_obj['end_time']) {
      option['end_time'] = Utils.change_date(this.edit_announcement_obj['end_time'], 'time');
    }

    this.modal_lodding = true;
    if (this.modal_type == 'create') {
      this.add_announcement_submit(option);
    } else if (this.modal_type == 'edit') {
      this.edit_announcement_submit(option);
    }

  }

    /**
   *修改状态
   *
   * @param {*} data
   * @memberof OperasyonadTypeComponent
   */
  edit_status(e,data) {
    let option = {
      id: data['id'],
      title: data['title'],
      status: e?1:0,
      content: data['content'],
      start_time: data['start_time'],
      end_time: data['end_time'],
      type:1
    };
    this.edit_announcement_submit(option);
  }
  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonannouncementManageComponent
   */
  add_announcement_submit(data) {
    this.userManageService.add_announcement(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.get_announcement_list(1);
        this.message.success('添加公告成功', {
          nzDuration: 10000,
        });

        this.if_show_modal = false;

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

    /**
   *开始时间变化
   *
   * @memberof OperasyonActivityListComponent
   */
  on_change_start(item) { }
  /**
 *开始时间确定
 *
 * @memberof OperasyonActivityListComponent
 */
  on_ok_start(item) { }
  /**
 *结束时间变化
 *
 * @memberof OperasyonActivityListComponent
 */
  on_change_end(item) { }
  /**
*结束时间确定
*
* @memberof OperasyonActivityListComponent
*/
  on_ok_end(item) { }
  /**
   *调用修改
   *
   * @param {*} data
   * @memberof OperasyonannouncementManageComponent
   */
  edit_announcement_submit(data) {
    this.userManageService.edit_announcement(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.if_show_modal = false;
        this.get_announcement_list(1);
        this.update_form();
        this.message.success('修改公告成功', {
          nzDuration: 10000,
        });

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
 *d刷新表单
 *
 * @memberof OperasyonActivityListComponent
 */
  update_form() {
    this.edit_announcement_obj = {
      content: ''
    }
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }
  /**
   * 获取公告分类
   */
  get_announcement_type() {
    // this.userManageService.get_announcement_type().subscribe((res: any) => {
    //   if (res && res.success) {
    //     this.announcement_type_list = res.data;

    //   } else {

    //     this.message.error(res.message, {
    //       nzDuration: 10000,
    //     });
    //   }
    // })
  }
  /**
   *获取公告列表
   *
   * @param {*} page_index
   * @memberof OperasyonannouncementManageComponent
   */
  get_announcement_list(page_index) {
    this.is_load_list = true;
    this.userManageService.get_announcement(page_index).subscribe((res: any) => {
      if (res && res.success) {
        this.page_index = page_index
        // this.list_total = res.data.total;
        this.list_total = res.data.length;
        this.is_load_list = false;
     
        this.list_of_aply_data = res.data;

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *点击添加公告
   *
   * @memberof OperasyonannouncementManageComponent
   */
  add_announcement() {
    window.upload_iri = Utils.get_upload_iri('announcement');

    this.if_show_modal = true;
    this.modal_type = 'create';
    this.update_form();
  }
  /**
   *拖动排序
   *
   * @memberof OperasyonannouncementManageComponent
   */
  drop_announcement(event: CdkDragDrop<string[]>): void {
    let old_array = JSON.parse(JSON.stringify(this.list_of_aply_data));
    if (event.previousIndex != event.currentIndex) {
      moveItemInArray(this.list_of_aply_data, event.previousIndex, event.currentIndex);
      let first_index = event.previousIndex > event.currentIndex ? event.currentIndex : event.previousIndex;
      let last_index = event.previousIndex > event.currentIndex ? event.previousIndex : event.currentIndex;
      let option = {
        sort_type: event.previousIndex > event.currentIndex ? 1 : 2,
        front_id: this.list_of_aply_data[first_index].id,
        front_sort: old_array[first_index].sort,
        rearways_id: this.list_of_aply_data[last_index].id,
        rearways_sort: old_array[last_index].sort
      }
      this.is_load_list = true;
      this.userManageService.sort_announcement(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
          this.get_announcement_list(this.page_index);
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      })
    }
  }
  /**
   *置顶
   *
   * @memberof OperasyonannouncementManageComponent
   */
  announcement_to_up(item) {
    this.is_load_list = true;
    let option = {
      id: item.id,  //公告id
    };
    this.userManageService.top_announcement(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.get_announcement_list(1);
        this.message.success('公告置顶成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *点击编辑
   *
   * @memberof OperasyonannouncementManageComponent
   */
  edit_announcement(data) {
    window.upload_iri = Utils.get_upload_iri('announcement');
    this.if_show_modal = true;
    this.modal_type = 'edit';
    // this.update_form();
    this.edit_announcement_obj = JSON.parse(JSON.stringify(data));
    this.edit_announcement_obj['status']=String(this.edit_announcement_obj['status']);
    this.edit_announcement_obj['content'] = Utils.get_img_iri(this.edit_announcement_obj['content'], 'add').content;
    if (data.start_time) {
      this.edit_announcement_obj['start_time'] = new Date(data.start_time);
    }
    if (data.end_time) {
      this.edit_announcement_obj['end_time'] = new Date(data.end_time);
    }
    console.log(this.edit_announcement_obj);
  }
  /**
   * 点击删除
   *
   * @memberof OperasyonannouncementManageComponent
   */
  delete_announcement(data) {
    let option = {
      id: data.id
    }
    this.is_load_list = true;
    this.userManageService.delete_announcement(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.get_announcement_list(1);
        this.message.success('删除公告成功', {
          nzDuration: 10000,
        });

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /** */
  /**
   * 点击列表项展示详情
   */
  // show_content(data, type) {
  //   this.if_show_modal = true;
  //   if (type == 'object') {
  //     let value = JSON.parse(data);
  //     this.show_text = JSON.stringify(value, undefined, 2);
  //   } else {
  //     this.show_text = data;
  //   }
  // }


  /**
   *取消搜索
   *
   * @memberof UserPassportCheckComponent
   */
  //  reset(): void {
  //   this.searchValue = '';
  //   this.search();
  // }
  /**
   *搜索数组
   *
   * @memberof UserPassportCheckComponent
   */
  // search(): void {
  //   const filterFunc = (item) => {
  //     return (

  //        item.username.indexOf(this.searchValue) !== -1
  //     );
  //   };
  //   const data = this.list_of_data['data'].filter((item) => filterFunc(item));
  //   this.list_of_aply_data = data.sort((a, b) =>
  //     this.sortValue === 'ascend'
  //       ? a[this.sortName!] > b[this.sortName!]
  //         ? 1
  //         : -1
  //       : b[this.sortName!] > a[this.sortName!]
  //       ? 1
  //       : -1
  //   );
  // }
  /**
  *改变页数
  *
  * @param {*} item
  * @memberof UserManageUserComponent
  */
  chang_page_index(item) {
    this.get_announcement_list(item);
  }
  /*
*
*获取用户管理列表
*
* @memberof UserManageUserComponent
*/
  // get_log_list(page_index) {
  //   this.is_load_list = true;
  //   this.userManageService.get_log_list(page_index).subscribe((res: any) => {
  //     if (res && res.success) {
  //       this.list_total = res.data.total;
  //       this.is_load_list = false;
  //       this.list_of_data = res.data;
  //       this.list_of_aply_data = [...this.list_of_data['data']];

  //     } else {
  //       this.is_load_list = false;
  //       this.message.error(res.message, {
  //         nzDuration: 10000,
  //       });
  //     }
  //   })
  // }


  _ready(e) { }
  _destroy() { }
  _change(e) { }
}

