import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'equipmentType',
})
export class EquipmentTypePipe implements PipeTransform {
  /**
   * 设备类型
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetStatusPipe
   */
  transform(value: number) {
    let status: string;
    switch (value) {
  
      case 1: status = 'PHONE'; break;
      case 2: status = 'DESKSTOP'; break;
      case 3: status = 'ROBOT'; break;
      case 4: status = 'MOBILE'; break;
      case 5: status = 'TABLET'; break;
      case 6: status = 'OTHER'; break;
      default: break;
    }
    return status;
  }
}
