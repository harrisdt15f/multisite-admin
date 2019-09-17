import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { UserManageService } from 'app/service/user-manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UEditorComponent } from 'ngx-ueditor';
import { until } from 'protractor';
import { Utils } from 'config/utils.config';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-operasyon-article-manage',
  templateUrl: './article-manage.component.html',
  styleUrls: ['./article-manage.component.less']
})
export class OperasyonArticleManageComponent implements OnInit {
  @ViewChild('full',{static: false})
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
  public modal_type: string = 'create';
  public create_form: FormGroup;//表单对象
  public modal_lodding: boolean;//显示加载图标
  public edit_article_obj: object = {
    content: ''
  };//显示加载图标
  public article_type_list: Array<any> = [];//文章分类列表
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
      summary: [null, [Validators.required]],
      content: [null, [Validators.required]],
      search_text: [null, [Validators.required]],
      is_for_agent: [null],
      apply_note: [null, [Validators.required]],
      category_id: [null, [Validators.required]]
    });
    this.get_article_type();
    this.get_article_list(1);
  }
  /**
   *提交
   *
   * @memberof OperasyonArticleManageComponent
   */
  submit_activity() {
    let option = {
      id: this.edit_article_obj['id'],
      category_id: this.edit_article_obj['category_id'],
      title: this.edit_article_obj['title'],
      summary: this.edit_article_obj['summary'],
      search_text: this.edit_article_obj['search_text'],
      is_for_agent: this.edit_article_obj['is_for_agent'],
      apply_note: this.edit_article_obj['apply_note']
    };

    let img_obj = Utils.get_img_iri(this.edit_article_obj['content'], 'remove');
    option['content'] = img_obj.content;
    if (img_obj.pic_path.length > 0 && img_obj.pic_name.length > 0) {
      option['pic_path'] = img_obj.pic_path;
      option['pic_name'] = img_obj.pic_name;
    }

    this.modal_lodding = true;
    if (this.modal_type == 'create') {
      this.add_article_submit(option);
    } else if (this.modal_type == 'edit') {
      this.edit_article_submit(option);
    }

  }
  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonArticleManageComponent
   */
  add_article_submit(data) {
    this.userManageService.add_article(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.get_article_list(1);
        this.message.success('添加文章成功', {
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
   *调用修改
   *
   * @param {*} data
   * @memberof OperasyonArticleManageComponent
   */
  edit_article_submit(data) {
    this.userManageService.edit_article(data).subscribe((res: any) => {
      this.modal_lodding = false;
      if (res && res.success) {
        this.if_show_modal = false;
        this.get_article_list(1);
        this.update_form();
        this.message.success('修改文章成功', {
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
    this.edit_article_obj = {
      content: ''
    }
    this.create_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
  }
  /**
   * 获取文章分类
   */
  get_article_type() {
    this.userManageService.get_article_type().subscribe((res: any) => {
      if (res && res.success) {
        this.article_type_list = res.data;

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   *获取文章列表
   *
   * @param {*} page_index
   * @memberof OperasyonArticleManageComponent
   */
  get_article_list(page_index) {
    this.is_load_list = true;
    this.userManageService.get_article_list(page_index).subscribe((res: any) => {
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
   *点击添加文章
   *
   * @memberof OperasyonArticleManageComponent
   */
  add_article() {

    this.if_show_modal = true;
    this.modal_type = 'create';
    this.update_form();
  }
  /**
   *拖动排序
   *
   * @memberof OperasyonArticleManageComponent
   */
  drop_article(event: CdkDragDrop<string[]>): void {
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
      this.userManageService.sort_article(option).subscribe((res: any) => {
        this.is_load_list = false;
        if (res && res.success) {
          this.get_article_list(this.page_index);
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
   * @memberof OperasyonArticleManageComponent
   */
  article_to_up(item) {
    this.is_load_list = true;
    let option = {
      id: item.id,  //文章id
      sort: item.sort  //文章的sort
    };
    this.userManageService.top_articles(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.get_article_list(1);
        this.message.success('文章置顶成功', {
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
   * @memberof OperasyonArticleManageComponent
   */
  edit_article(data) {
    this.if_show_modal = true;
    this.modal_type = 'edit';
    // this.update_form();
    this.edit_article_obj = JSON.parse(JSON.stringify(data));
    this.edit_article_obj['status']=String(this.edit_article_obj['status']);
    this.edit_article_obj['content'] = Utils.get_img_iri(this.edit_article_obj['content'], 'add').content;
    console.log(this.edit_article_obj);
  }
  /**
   * 点击删除
   *
   * @memberof OperasyonArticleManageComponent
   */
  delete_article(data) {
    let option = {
      id: data.id
    }
    this.is_load_list = true;
    this.userManageService.delete_article(option).subscribe((res: any) => {
      this.is_load_list = false;
      if (res && res.success) {
        this.get_article_list(1);
        this.message.success('删除文章成功', {
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
    this.get_article_list(item);
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
