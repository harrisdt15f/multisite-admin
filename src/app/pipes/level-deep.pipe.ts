import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelDeep',
})
export class LevelDeepPipe implements PipeTransform {
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
      case 1: status = '总代'; break;
      case 2: status = '代理'; break;
      case 3: status = '会员'; break;
      default: break;
    }
    return status;
  }
}
