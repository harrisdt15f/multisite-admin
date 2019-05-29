import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frozenType',
})
export class FrozenTypePipe implements PipeTransform {
  /**
   * 投注状态
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: number) {
    let status: string;
    switch (value) {
      case 0: status = '无冻结'; break;
      case 1: status = '禁止登录'; break;
      case 2: status = '禁止投注'; break;
      case 3: status = '禁止提现'; break;
      default: break;
    }
    return status;
  }
}
