import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UEditorComponent } from 'ngx-ueditor';
import { until } from 'protractor';
import { Utils } from 'config/utils.config';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ToolService } from 'tool/tool.service';
declare let window: any;
@Component({
  selector: 'app-operasyon-announcement-manage',
  templateUrl: './announcement-manage.component.html',
  styleUrls: ['./announcement-manage.component.less'],
})
export class OperasyonAnnouncementManageComponent implements OnInit {
  @ViewChild('full')
  full: UEditorComponent;
  html: string;
  public serviceHttpIri: string;
  public page_index = 1;
  public list_of_data: object = {};
  public list_of_aply_data: Array<any> = [];
  public list_total: number;
  public nzTitle = '';
  public page_tabs = [
    { title: '平台公告' },
    { title: '站内信' },
  ];
  // 公告
  public notice = {
    list: {
      title: null,
      content: null,
      type: 1,
      start_time: null,
      end_time: null,
      page_size: 20,
      page: 1
    }
  };
  public is_load_list: boolean;
  public show_text: string;
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
      title: '平台公告',
      id: 1
    },
    {
      title: '站内信公告',
      id: 2
    }
  ];//公告分类列表
  public html_content: string = '';
  constructor(
    private http: _HttpClient,
    private userManageService: UserManageService,
    private fb: FormBuilder,
    public utilsService: ToolService,
    private message: NzMessageService
  ) {
    this.serviceHttpIri = Utils.GethttpIri();
  }

  ngOnInit() {
    this.create_form = this.fb.group({
      title: [null, [Validators.required]],
      introduction: [null, [Validators.required]],
      content: [null, [Validators.required]],
      type: [null],
      start_time: [null, [Validators.required]],
      status: [null, [Validators.required]],
      end_time: [null, [Validators.required]]
    });
    // this.get_announcement_type();
    this.get_announcement_list();
  }
  /**
   *提交
   *
   * @memberof OperasyonannouncementManageComponent
   */
  public submit_activity() {
    let option = {
      id: this.edit_announcement_obj['id'],
      title: this.edit_announcement_obj['title'],
      status: this.edit_announcement_obj['status'] ? '1' : '0',
      introduction: this.edit_announcement_obj['introduction'],
      type: this.notice.list.type
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
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonannouncementManageComponent
   */
  add_announcement_submit(data) {
    this.userManageService.add_announcement(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.get_announcement_list();
        this.message.success('添加成功', {
          nzDuration: 10000,
        });
        this.if_show_modal = false;
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    });
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
   */
  edit_announcement_submit(data) {
    this.userManageService.edit_announcement(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.if_show_modal = false;
        this.get_announcement_list();
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
 *刷新表单
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
   *获取公告列表
   */
  get_announcement_list() {
    this.is_load_list = true;
    this.userManageService.get_announcement(this.notice.list).subscribe((res: any) => {
      if (res && res.success) {
        let data = res.data.data;
        this.list_total = res.data.total;
        this.is_load_list = false;
        for (const k of data) {
          k['content'] = Utils.get_img_iri(k['content'], 'add');
        }
        console.log(data)
        this.list_of_aply_data = data;
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
  public add_announcement() {
    this.if_show_modal = true;
    this.modal_type = 'create';
    if (this.notice.list.type === 1) {
      this.nzTitle = '添加公告';
    } else {
      this.nzTitle = '添加站内信';
    }
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
      };
      this.is_load_list = true;
      this.userManageService.sort_announcement(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
          this.get_announcement_list();
        } else {
          this.message.error(res.message, {
            nzDuration: 10000,
          });
        }
      });
    }
  }
  /**
   *点击编辑
   *
   * @memberof OperasyonannouncementManageComponent
   */
  edit_announcement(data: any) {
    this.if_show_modal = true;
    this.modal_type = 'edit';
    if (this.notice.list.type === 1) {
      this.nzTitle = '编辑公告';
    } else {
      this.nzTitle = '编辑站内信';
    }
    // this.update_form();
    this.edit_announcement_obj = JSON.parse(JSON.stringify(data));
    this.edit_announcement_obj['status'] = String(this.edit_announcement_obj['status']);
    this.edit_announcement_obj['content'] = data.content.content;
    if (data.start_time) {
      this.edit_announcement_obj['start_time'] = new Date(data.start_time);
    }
    if (data.end_time) {
      this.edit_announcement_obj['end_time'] = new Date(data.end_time);
    }
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
        this.get_announcement_list();
        this.message.success('删除成功', {
          nzDuration: 10000,
        });

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  public chang_page_index(item: any) {
    this.notice.list.page = item;
    this.get_announcement_list();
  }
  // 切换公告
  public change_index(e: any) {
    if (!e) {
      this.notice.list.type = 1;
    } else {
      this.notice.list.type = 2;
    }
    this.get_announcement_list();
  }
  public _ready(e) { }
  public _destroy() { }
  public _change(e) { }
}

