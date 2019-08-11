import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkStatus',
})
export class CheckStatusPipe implements PipeTransform {
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
      case 0: status = '待审核'; break;
      case 1: status = '审核通过'; break;
      case 2: status = '审核拒绝'; break;
      default: break;
    }
    return status;
  }
}
