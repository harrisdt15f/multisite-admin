import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rechargeStatus',
})
export class RechargeStatusPipe implements PipeTransform {
  /**
   * 
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: number) {
    let status: string;
    switch (value) {
      case 0: status = '正在充值'; break;
      case 1: status = '充值成功'; break;
      case 2: status = '充值失败'; break;
      case 10: status = '待审核'; break;
      case 11: status = '审核通过'; break;
      case 12: status = '审核拒绝'; break;
      default: break;
    }
    return status;
  }
}
