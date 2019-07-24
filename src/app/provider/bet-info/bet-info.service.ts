import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BetInfoService {

  // 注单内容
  private permission_setting_name: BehaviorSubject<string>;
  //刷新用户管理
  private user_manager_update: BehaviorSubject<string>;


  constructor() {
    this.permission_setting_name = new BehaviorSubject(null);
    this.user_manager_update = new BehaviorSubject(null);

  }

  // 注单内容
  set_permission_setting_name(val) {
    this.permission_setting_name.next(val);
  }

  get_permission_setting_name() {
    return this.permission_setting_name.asObservable();
  }
  // 刷新用户管理
  set_user_manager_update(val) {
    this.permission_setting_name.next(val);
  }

  get_user_manager_update() {
    return this.permission_setting_name.asObservable();
  }


}
