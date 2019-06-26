import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userBet',
})
export class UserBetPipe implements PipeTransform {
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
      case 0: status = '待开奖'; break;
      case 1: status = '已撤销'; break;
      case 2: status = '未中奖'; break;
      case 3: status = '已中奖'; break;
      case 4: status = '已派奖'; break;

      default: break;
    }
    return status;
  }
}
