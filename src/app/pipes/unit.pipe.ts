import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unit',
})
export class NnitPipe implements PipeTransform {
  /**
   * 投注单位
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: any) {
    value=Number(value);
    switch (value) {
        case 1: value = '元'; break;
        case 2: value = '角'; break;
        case 3: value = '分'; break;
        default: break;
      }
      return value;
  }
}
