import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BetInfoService {

  // 注单内容
  private permission_setting_name: BehaviorSubject<string>;
 

  constructor() {
    this.permission_setting_name = new BehaviorSubject(null);

  }

  // 注单内容
  set_permission_setting_name(val) {
    this.permission_setting_name.next(val);
  }

  get_permission_setting_name() {
    return this.permission_setting_name.asObservable();
  }


}
