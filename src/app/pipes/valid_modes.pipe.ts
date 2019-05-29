import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validModes',
})
export class ValidModesPipe implements PipeTransform {
  /**
   * 投注单位
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: string) {
    let type_array=value.split(',');
    let arry=type_array.map((item)=>{
      switch (item) {
        case '1': item = '元'; break;
        case '2': item = '角'; break;
        case '3': item = '分'; break;
        default: break;
      }
      return item;
    })
  
    return arry;
  }
}
