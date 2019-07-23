import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzTreeNode, NzDropdownContextComponent, NzDropdownService, NzMessageService } from 'ng-zorro-antd';
import { DeveloperService } from 'app/service/developer.service';
import { StartupService } from '@core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { config } from 'rxjs';

@Component({
  selector: 'app-developer-betting-menu',
  templateUrl: './betting-menu.component.html',
  styleUrls: ['./betting-menu.component.less']
})
export class DeveloperBettingMenuComponent implements OnInit {
  public model_tabs = [];
  public dropdown: NzDropdownContextComponent;
  public page_type: number;
  public searchValue: string;
  public search_route: string;
  public activedNode: NzTreeNode;
  public edit_menu_nodes = [];//模块数组
  public edit_route_nodes = [];//路由数组
  public is_loading_tree: boolean;
  public route_obj: Object = {};
  public route_choise_obj: Object = {};
  //---------------路由下拉加载框参数
  public optionList: any[] = [];
  public isLoading = false;

  //---------------弹框参数
  public create_form: FormGroup;//表单对象
  public route_form: FormGroup;//表单对象
  public modal_type: string = 'create';//弹框是编辑还是创建
  public isOkLoading: boolean;
  public is_show_edit_menu: boolean;
  public is_show_edit_route: boolean;
  public edit_menu_obj: object = {};  //模块编辑对象
  public edit_route_obj: object = {}; //路由编辑对象
  public edit_route_menu: object = {};
  public route_array: Array<any> = [];
  public route_array_total: Array<any> = [];

  constructor(
    private http: _HttpClient,
    private developerService: DeveloperService,
    private message: NzMessageService,
    private startupService: StartupService,
    private fb: FormBuilder,
    private nzDropdownService: NzDropdownService
  ) {


  }
  ngOnInit() {
    this.page_type = 2;
    this.get_route_list();
    this.load_menu();

    // this.edit_menu_nodes = this.startupService.menu_list;
    console.log(this.edit_menu_nodes);
    this.create_form = this.fb.group({
      label: [null, [Validators.required]],
      pid: [null],
      type: [null],
      en_name: [null, [Validators.required]],
    });
    this.route_form = this.fb.group({
      route: [null, [Validators.required]],
      title: [null, [Validators.required]],

    });
    this.model_tabs = [
      {
        label: "PC端",
        type: 2
      },
      {
        label: "app端",
        type: 3
      }
    ];
  }

  /**
   * 切换tab
   * @param e 
   */
  change_index(e) {
    switch (e) {
      case 0:
        this.page_type = 2
        break;
      case 1:
        this.page_type = 3
        break;
    };
    this.get_route_list();
  }
  //-----------------------start 
  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activedNode = data.node!;
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  selectDropdown(): void {
    this.dropdown.close();
    // do something
  }
  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);

  }

  //-----------------------end

  load_menu(): void {
    this.isLoading = true;
    this.optionList = [];
    let data = {
      type: this.page_type
    }
    this.developerService.get_route_new_api_list(data).subscribe((res: any) => {
      if (res && res.success) {
        res.data.route_info.forEach((item, index) => {
          let d = item;
          d.value = d['route_name'] + '(' + d['url'] + ')';
          this.optionList.push(d);
        });

      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  /**
   * 搜索路由
   */
  change_search_route(e) {
    let serrch_list = [];
    if(e){
      this.route_array_total.forEach((item, index) => {
        if (item.route_name.indexOf(e) > -1 || item.title.indexOf(e) > -1|| item.real_route.indexOf(e) > -1) {
          serrch_list.push(item);
        }
      });
      this.route_array=JSON.parse(JSON.stringify(serrch_list));
    }else{
      this.route_array=JSON.parse(JSON.stringify(this.route_array_total));
    }
  }
  /**
   * route选择改变
   * @param e 
   */
  change_route_obj(e) {
    this.route_choise_obj = {};
    this.optionList.forEach((item, index) => {
      if (item.route_name === e)
        this.route_choise_obj = item;

    })
  }

  /**
   * 获取路由树
   */
  get_route_list() {
    this.edit_route_menu = {};
    this.is_loading_tree = true;
    this.developerService.get_betting_route_list(this.page_type).subscribe((res: any) => {
      if (res && res.success) {
        if (res.data && res.data.length > 0) {
          this.route_array = res.data;
          this.route_array_total = JSON.parse(JSON.stringify(res.data));
          res.data.forEach((item, index) => {
            if (!this.edit_route_menu[item.frontend_model_id]) {
              this.edit_route_menu[item.frontend_model_id] = [];
            };
            this.edit_route_menu[item.frontend_model_id].push(item);
          });
        }

        this.get_all_menu();

        console.log(this.edit_route_menu);
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
   *获取模块树
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  get_all_menu() {
    let data = {
      type: this.page_type
    }
    this.developerService.get_all_model(data).subscribe((res: any) => {
      this.is_loading_tree = false;
      if (res && res.success) {
        this.edit_menu_nodes = [];
        this.edit_route_nodes = [];
        this.getMenueTree(JSON.parse(JSON.stringify(res.data)), this.edit_menu_nodes);
        this.get_route_tree(JSON.parse(JSON.stringify(res.data)), this.edit_route_nodes);
        console.log(this.edit_route_nodes)
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }




    })
  }

  /**
   *点击编辑模块
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  edit_menu() {
    this.modal_type = 'edit';
    this.is_show_edit_menu = true;
    this.edit_menu_obj = {
      label: this.activedNode.origin['title'],
      en_name: this.activedNode.origin['en_name'],
      id: this.activedNode.origin['key'],
      level: this.activedNode.origin['level'],
      ptype: this.activedNode.origin['ptype'],
      type: String(this.activedNode.origin['type']),
      pid: this.activedNode.origin['pid']
    };
    console.log(this.edit_menu_obj);
  }
  /**
 *
 *点击创建子模块按钮
 * @memberof DeveloperDeveloperMenuComponent
 */
  create_menu() {
    this.modal_type = 'create';
    this.is_show_edit_menu = true;
    this.edit_menu_obj = {
      pid: this.activedNode.origin['key'],
      level: this.activedNode.origin['level'] + 1,
      ptype: this.activedNode.origin['type'],
      type: String(this.activedNode.origin['type']),
    };
  }
  /**
   *
   *点击创建一级模块按钮
   * @memberof DeveloperDeveloperMenuComponent
   */
  add_parent_menu() {
    this.modal_type = 'create';
    this.is_show_edit_menu = true;
    this.edit_menu_obj = {
      isParent: '1',
      level: 1,
      type: '1',
      ptype: 1,

    };
  }


  /**
   *删除模块
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  delete_menu() {
    let data = {
      id: this.activedNode.origin['key']
    };
    this.developerService.delete_model(data).subscribe((res: any) => {
      if (res && res.success) {
        this.get_route_list();
        this.message.success('删除模块成功', {
          nzDuration: 10000,
        });
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  //取消每日资金弹框
  cancel_data_prize() {
    this.isOkLoading = false;
    this.is_show_edit_menu = false;
    this.is_show_edit_route = false;
    this.update_form();

  }

  // change_display_btn(e, obj) {
  //   let option = {
  //     menuId: obj['key'],
  //     label: obj['title'],
  //     parentId: obj['pid'],
  //     level: obj['level'],
  //     en_name: obj['en_name'],
  //   }
  //   obj['display'] = obj['display'] ? 1 : 0;
  //   this.edit_menu_submit(option);
  // }
  /**切换路由开放状态 */
  change_is_open_btn(e, obj) {
    let option = {
      id: obj['key']?obj['key']:obj['id'],
      is_open: obj['is_open'] ? 1 : 0
    }
    this.developerService.is_open_route(option, this.page_type).subscribe((res: any) => {
      if (res && res.success) {
        this.message.success('修改路由开放状态成功', {
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
   * 点击提交路由
   */

  submit_route() {
    let option = {
      route_name: this.route_choise_obj['route_name'],
      controller: this.route_choise_obj['controller'].split('@')[0],
      method: this.route_choise_obj['controller'].split('@')[1],
      frontend_model_id: this.edit_menu_obj['key'],
      title: this.edit_route_obj['title'],
    };
    this.isOkLoading = true;
    if (this.modal_type == 'create') {
      this.add_route_submit(option);
    } else if (this.modal_type == 'edit') {
      // this.edit_route_submit(option);
    }
  }
  /**
  *调用添加
  *
  * @param {*} data
  * @memberof OperasyonArticleManageComponent
  */
  add_route_submit(data) {
    this.developerService.add_betting_route(data).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.get_route_list();
        this.message.success('添加路由成功', {
          nzDuration: 10000,
        });
        this.update_form();

        this.is_show_edit_route = false;

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
  // edit_route_submit(data) {
  //   this.developerService.edit_route(data).subscribe((res: any) => {
  //     this.isOkLoading = false;
  //     if (res && res.success) {
  //       this.is_show_edit_route = false;
  //       this.get_route_list();

  //       this.update_form();
  //       this.message.success('修改模块成功', {
  //         nzDuration: 10000,
  //       });

  //     } else {

  //       this.message.error(res.message, {
  //         nzDuration: 10000,
  //       });
  //     }
  //   })
  // }

  /**
   *提交模块
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  submit_menu() {

    let option = {
      id: this.edit_menu_obj['id'],
      label: this.edit_menu_obj['label'],
      type: Number(this.edit_menu_obj['type']),
      pid: this.edit_menu_obj['pid'] ? this.edit_menu_obj['pid'] : 0,
      level: this.edit_menu_obj['level'],
      en_name: this.edit_menu_obj['en_name'],
    }
    this.isOkLoading = true;

    if (this.modal_type == 'create') {
      this.add_menu_submit(option);
    } else if (this.modal_type == 'edit') {
      this.edit_menu_submit(option);
    }

  }
  /**
   *调用添加
   *
   * @param {*} data
   * @memberof OperasyonArticleManageComponent
   */
  add_menu_submit(data) {
    this.developerService.add_model(data).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.get_route_list();
        this.message.success('添加模块成功', {
          nzDuration: 10000,
        });
        this.update_form();
        this.is_show_edit_menu = false;
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
  edit_menu_submit(data) {
    this.developerService.edit_model(data).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.is_show_edit_menu = false;
        this.get_route_list();

        this.update_form();
        this.message.success('修改模块成功', {
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
   * 编辑路由
   * @param data 
   */
  edit_route(data) {
    this.is_show_edit_route = true;
    this.modal_type = 'edit';

    this.edit_route_obj = {
      id: data.key,
      title: data.title,
      menu_group_id: data.menu_group_id,
      route: data.route_name
    }
  }
  /**
   * 
   * @param data 删除路由
   */
  delete_route(data) {
    let option = {
      id: data.key
    }
    this.developerService.delete_betting_route(option).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.get_route_list();
        this.message.success('删除路由成功', {
          nzDuration: 10000,
        });

      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }
  add_route(data) {
    this.is_show_edit_route = true;
    this.edit_menu_obj = data;

  }


  /**
 *d刷新表单
 *
 * @memberof OperasyonActivityListComponent
 */
  update_form() {
    this.edit_menu_obj = {};
    this.create_form.reset();
    this.route_form.reset();
    for (const key in this.create_form.controls) {
      this.create_form.controls[key].markAsPristine();
      this.create_form.controls[key].updateValueAndValidity();
    }
    for (const key in this.route_form.controls) {
      this.route_form.controls[key].markAsPristine();
      this.route_form.controls[key].updateValueAndValidity();
    }
  }

  /**
* 得到创建组中的模块树
*/
  getMenueTree(item, array) {
    item.forEach((data) => {
      let obj = {
        key: Number(data.id),
        value: Number(data.id),
        title: data.label,
        type: data.type,
        en_name: data.en_name,
        expanded: true,
        level: data.level,
        pid: data.pid,
      };
      if (data.childs && data.childs.length > 0) {
        obj['children'] = []
        this.getMenueTree(data.childs, obj['children'])
      }
      array.push(obj);
    });
  }
  /**
* 得到创建组中的模块-路由树
*/
  get_route_tree(item, array) {
    item.forEach((data) => {
      let obj = {
        key: Number(data.id),
        value: Number(data.id),
        title: data.label,
        type: data.type,
        en_name: data.en_name,
        expanded: true,
        level: data.level,
        pid: data.pid,
        children: []
      };
      if (this.edit_route_menu[Number(data.id)]) {
        this.edit_route_menu[Number(data.id)].forEach((d) => {
          let o = {
            key: Number(d.id),
            value: Number(d.id),
            title: d.title,
            is_route: true,
            isLeaf: true,
            is_open: d.is_open === 1 ? true : false,

            level: data.level,
            route_name: d.route_name,
            children: []
          }
          obj['children'].push(o)
        })
      }
      if (data.childs && data.childs.length > 0) {
        this.get_route_tree(data.childs, obj['children'])
      }
      array.push(obj);
    });
  }


}

