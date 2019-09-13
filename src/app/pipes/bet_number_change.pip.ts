import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'betNumber',
})
export class BetNumber implements PipeTransform {
  /**
   * 投注号码
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: string) {
    let newString=value.split('&').join(',');
    return newString;
  }
}
