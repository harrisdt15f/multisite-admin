import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzFormatEmitEvent, NzTreeNode, NzDropdownContextComponent, NzDropdownService, NzMessageService, isTemplateRef } from 'ng-zorro-antd';
import { DeveloperService } from 'app/service/developer.service';
import { StartupService } from '@core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { config } from 'rxjs';

@Component({
  selector: 'app-developer-developer-menu',
  templateUrl: './developer-menu.component.html',
  styleUrls: ['./developer-menu.component.less']
})
export class DeveloperDeveloperMenuComponent implements OnInit {

  public dropdown: NzDropdownContextComponent;
  // actived node
  public activedNode: NzTreeNode;
  public edit_menu_nodes = [];//菜单数组
  public edit_route_nodes = [];//路由数组
  public is_loading_tree: boolean;
  public route_obj: Object = {};
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
  public edit_menu_obj: object = {};  //菜单编辑对象
  public edit_route_obj: object = {}; //路由编辑对象
  public route_choise_obj: object = {}; //路由编辑对象

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

    this.get_route_list();
    this.load_menu();
    // this.edit_menu_nodes = this.startupService.menu_list;
    console.log(this.edit_menu_nodes);
    this.create_form = this.fb.group({
      label: [null, [Validators.required]],
      pid: [null],
      icon: [null],
      route: [null, [Validators.required]],
      en_name: [null, [Validators.required]],
      isParent: [null, [Validators.required]],
      display: [null, [Validators.required]],
    });
    this.route_form = this.fb.group({
      route: [null, [Validators.required]],
      title: [null, [Validators.required]],

    });
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
    let option = {
      type: 0
    }
    this.developerService.get_route_new_api_list(option).subscribe((res: any) => {
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
   * 获取路由树
   */
  get_route_list() {
    this.edit_menu_obj = {};
    this.is_loading_tree = true;
    this.developerService.get_route_list().subscribe((res: any) => {
      if (res && res.success) {
        res.data.forEach((item, index) => {
          if (!this.edit_menu_obj[item.menu_group_id]) {
            this.edit_menu_obj[item.menu_group_id] = [];
          };
          this.edit_menu_obj[item.menu_group_id].push(item);
        });
        this.get_all_menu();

        console.log(this.edit_menu_obj);
      } else {
        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }
    })
  }

  /**
   *获取菜单树
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  get_all_menu() {
    this.developerService.get_all_menu().subscribe((res: any) => {
      this.is_loading_tree = false;
      if (res && res.success) {
        this.getMenueTree(res.data);
      } else {

        this.message.error(res.message, {
          nzDuration: 10000,
        });
      }




    })
  }

  /**
   *点击编辑菜单
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  edit_menu() {
    this.modal_type = 'edit';
    this.is_show_edit_menu = true;
    this.edit_menu_obj = {
      label: this.activedNode.origin['title'],
      en_name: this.activedNode.origin['en_name'],
      icon: this.activedNode.origin['icon'],
      route: this.activedNode.origin['route'],
      sort: this.activedNode.origin['sort'],
      id: this.activedNode.origin['key'],
      level: this.activedNode.origin['level'],
      pid: this.activedNode.origin['pid'],
      isParent: this.activedNode.origin['pid'] == 0 ? '1' : '0',
      display: String(this.activedNode.origin['display']) ? String(this.activedNode.origin['display']) : '1',
    };
    console.log(this.edit_menu_obj);
  }
  /**
 *
 *点击创建子菜单按钮
 * @memberof DeveloperDeveloperMenuComponent
 */
  create_menu() {
    this.modal_type = 'create';
    this.is_show_edit_menu = true;
    this.edit_menu_obj = {
      pid: this.activedNode.origin['key'],
      level: this.activedNode.origin['level'] + 1,
      isParent: '0',
      sort: this.activedNode['children'].length + 1,
      display: '1',
    };
  }
  /**
   *
   *点击创建一级菜单按钮
   * @memberof DeveloperDeveloperMenuComponent
   */
  add_parent_menu() {
    this.modal_type = 'create';
    this.is_show_edit_menu = true;
    this.edit_menu_obj = {
      isParent: '1',
      level: 1,
      sort: this.edit_menu_nodes.length + 1,
      display: '1',
    };
  }
  /**
   *便利得到左右的子节点key
   *
   * @param {*} array
   * @param {*} item
   * @memberof DeveloperDeveloperMenuComponent
   */
  get_child_id(array, item) {
    array.push(item.key);
    if (item.children && item.children.length > 0) {
      item.children.forEach((data, item) => {
        this.get_child_id(array, data);
      });
    }
  }

  /**
   *删除菜单
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  delete_menu() {
    let data = {
      toDelete: []
    };
    // data.toDelete.push(this.activedNode.origin['key'])
    this.get_child_id(data.toDelete, this.activedNode.origin);
    this.developerService.delete_menu(data).subscribe((res: any) => {

      if (res && res.success) {
        this.get_route_list();
        this.message.success('删除菜单成功', {
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
  /**
   * 
   * @param e 开关显示状态
   * @param obj 
   */
  change_display_btn(e, obj) {
    let option = {
      menuId: obj['key'],
      icon: obj['icon'],
      route: obj['route'],
      label: obj['title'],
      parentId: obj['pid'],
      isParent: obj['level'] == 1 ? 1 : 0,
      level: obj['level'],
      display: obj['display'] ? 1 : 0,
      en_name: obj['en_name'],
    }
    obj['display'] = obj['display'] ? 1 : 0;
    this.edit_menu_submit(option);
  }
  /**
   * route选择改变
   * @param e 
   */
  change_route_obj(e){
    this.route_choise_obj={};
    this.optionList.forEach((item,index)=>{
      if(item.route_name===e)
      this.route_choise_obj=item;

    })
  }
  /**
   * 点击提交路由
   */

  submit_route() {
    let option = {
      id: this.edit_route_obj['id'],
      route_name: this.route_choise_obj['route_name'],
      controller: this.route_choise_obj['controller'].split('@')[0],
      method: this.route_choise_obj['controller'].split('@')[1],
      title: this.edit_route_obj['title'],
    };
    this.isOkLoading = true;
    if (this.modal_type == 'create') {
      option['menu_group_id']=this.edit_menu_obj['key'];
      this.add_route_submit(option);
    } else if (this.modal_type == 'edit') {
      option['menu_group_id']=this.edit_route_obj['menu_group_id'];
      this.edit_route_submit(option);
    }
  }
  /**
  *调用添加
  *
  * @param {*} data
  * @memberof OperasyonArticleManageComponent
  */
  add_route_submit(data) {
    this.developerService.add_route(data).subscribe((res: any) => {
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
  edit_route_submit(data) {
    this.developerService.edit_route(data).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.is_show_edit_route = false;
        this.get_route_list();

        this.update_form();
        this.message.success('修改菜单成功', {
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
   *提交菜单
   *
   * @memberof DeveloperDeveloperMenuComponent
   */
  submit_menu() {

    let option = {
      menuId: this.edit_menu_obj['id'],
      icon: this.edit_menu_obj['icon'],
      route: this.edit_menu_obj['route'],
      label: this.edit_menu_obj['label'],
      sort: this.edit_menu_obj['sort'],
      parentId: this.edit_menu_obj['pid'],
      isParent: this.edit_menu_obj['isParent'],
      level: this.edit_menu_obj['level'],
      display: this.edit_menu_obj['display'],
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
    this.developerService.add_menu(data).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.get_route_list();
        this.message.success('添加菜单成功', {
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
    this.developerService.edit_menu(data).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res && res.success) {
        this.is_show_edit_menu = false;
        this.get_route_list();

        this.update_form();
        this.message.success('修改菜单成功', {
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
    this.is_show_edit_route=true;
    this.modal_type='edit';
 
    this.edit_route_obj={
      id:data.key,
      title:data.title,
      menu_group_id:data.menu_group_id,
      route:data.route_name
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
    this.developerService.delete_route(option).subscribe((res: any) => {
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
    this.edit_route_obj = {
      route:'',
      title:''
    };
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
* 得到创建组中的菜单树
*/
  getMenueTree(item) {

    let menuList = [];
    let routeList = [];
    for (let key in item) {
      let obj = {
        key: Number(key),
        value: Number(key),
        title: item[key].label,
        en_name: item[key].en_name,
        icon: item[key].icon,
        expanded: true,
        route: item[key].route,
        display: item[key].display,
        level: item[key].level,
        pid: item[key].pid,
        children: [],
      };
      let obj1 = JSON.parse(JSON.stringify(obj));
      if (this.edit_menu_obj[obj1.key]) {
        this.edit_menu_obj[obj1.key].forEach((item, index) => {
          obj1.children.push({
            key: item.id,
            is_route: true,
            value: item.id,
            isLeaf: true,
            route_name: item.route_name,
            menu_group_id: item.menu_group_id,
            title: item.title,
            description: item.description
          })
        });
      }
      if (item[key].child) {
        for (let x in item[key].child) {
          let second_obj = {
            key: Number(x),
            value: Number(x),
            route: item[key].child[x].route,
            title: item[key].child[x].label,
            en_name: item[key].child[x].en_name,
            display: item[key].child[x].display,
            level: item[key].child[x].level,
            pid: item[key].child[x].pid,
          };
          if (item[key].child[x].child) {
            second_obj['children'] = [];
            second_obj['expanded'] = true;
            for (let y in item[key].child[x].child) {
              // if(item[key].child[x].child[y].display===1){
              second_obj['children'].push({
                key: Number(y),
                value: Number(y),
                isLeaf: true,
                route: item[key].child[x].child[y].route,
                pid: item[key].child[x].child[y].pid,
                title: item[key].child[x].child[y].label,
                level: item[key].child[x].child[y].level,
                en_name: item[key].child[x].child[y].en_name,
                display: item[key].child[x].child[y].display,
              })
              // }

            }
          } else {
            second_obj['isLeaf'] = true;

          }
          let second_obj1 = JSON.parse(JSON.stringify(second_obj));
          if (this.edit_menu_obj[second_obj1.key] || second_obj1['children']) {
            second_obj1.isLeaf = false;
            if (!second_obj1['children']) {
              second_obj1['children'] = [];
            } else if (second_obj1['children'] && second_obj1['children'].length > 0) {
              second_obj1['children'].forEach((item) => {

                if (this.edit_menu_obj[item.key]) {
                  item.isLeaf = false;
                  item['children'] = [];
                  this.edit_menu_obj[item.key].forEach((data) => {
                    item['children'].push({
                      key: data.id,
                      value: data.id,
                      is_route: true,
                      isLeaf: true,
                      route_name: data.route_name,
                      menu_group_id: data.menu_group_id,
                      title: data.title,
                      description: data.description
                    })
                  });
                }
              });
            }
            if (this.edit_menu_obj[second_obj1.key]) {
              this.edit_menu_obj[second_obj1.key].forEach((item, index) => {
                second_obj1['children'].push({
                  key: item.id,
                  value: item.id,
                  is_route: true,
                  isLeaf: true,
                  route_name: item.route_name,
                  menu_group_id: item.menu_group_id,
                  title: item.title,
                  description: item.description
                })
              });
            }
          }
          obj.children.push(second_obj);
          obj1.children.push(second_obj1);
        }
      }
      menuList.push(obj);
      routeList.push(obj1);

    }
    this.edit_menu_nodes = menuList;
    this.edit_route_nodes = routeList;
  }


}
