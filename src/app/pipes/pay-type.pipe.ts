import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payType',
})
export class PayTypePipe implements PipeTransform {
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
      case 1: status = '银行'; break;
      case 2: status = '微信'; break;
      case 3: status = '支付宝'; break;
      default: break;
    }
    return status;
  }
}
