import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gameType',
})
export class GameTypePipe implements PipeTransform {
  /**
   * 游戏/玩法类型
   * 
   * @param {number} value 
   * @returns 
   * @memberof BetdataPipe
   */
  transform(value: string) {
    let data: string;
    switch (value) {
      //系列
      case 'ssc': data = '时时彩'; break;
      case 'letto': data = '乐透'; break;
      case 'k3': data = '快3'; break;
      case '3d': data = '3D'; break;
      case 'p3p5': data = '排列35'; break;
      case 'lhc': data = '六合彩'; break;
      case 'pk10': data = 'pk10'; break;
      //玩法
      case 'zhixuan': data = '直选'; break;
      case 'zuxuan': data = '组选'; break;
      case 'qita': data = '其它'; break;
      case 'dingweidan': data = '定位胆'; break;
      case '3budingwei': data = '三星不定位'; break;
      case '4budingwei': data = '四星不定位'; break;
      case '5budingwei': data = '五星不定位'; break;
      case 'dxds': data = '大小单双'; break;
      case 'quwei': data = '趣味'; break;
      case 'qujian': data = '区间'; break;
      case 'teshu': data = '特殊'; break;
      case 'renxuaner': data = '任选二'; break;
      case 'renxuansan': data = '任选三'; break;
      case 'renxuansi': data = '任选四'; break;
      case 'lhh': data = '龙虎和'; break;
      case 'budingwei': data = '不定位'; break;
      case 'quweixing': data = '趣味型'; break;
      case 'renxuanfushi': data = '任选复式'; break;
      case 'renxuandanshi': data = '任选单式'; break;
      case 'renxuandantuo': data = '任选胆拖'; break;
      case 'dantiaoyishai': data = '单挑一筛'; break;
      case 'erbutong': data = '二不同'; break;
      case 'ertonghao': data = '二同号'; break;
      case 'sanbutong': data = '三不同'; break;
      case 'santonghao': data = '三同号'; break;
      case 'sanlianhao': data = '三连号'; break;
      case 'hezhi': data = '和值'; break;
      case 'diyiming': data = '第一名'; break;
      case 'dierming': data = '第二名'; break;
      case 'caiqianer': data = '猜前二'; break;
      case 'disanming': data = '第三名'; break;
      case 'caiqiansan': data = '猜前三'; break;
      case 'disiming': data = '第四名'; break;
      case 'caiqiansi': data = '猜前四'; break;
      case 'diwuming': data = '第五名'; break;
      case 'caiqianwu': data = '猜前五'; break;
      case 'diliuming': data = '第六名'; break;
      case 'caiqianliu': data = '猜前六'; break;
      case 'diqiming': data = '第七名'; break;
      case 'dibaming': data = '第八名'; break;
      case 'dijiuming': data = '第九名'; break;
      case 'dishiming': data = '第十名'; break;
      case '3mabudingwei': data = '三码不定位'; break;
      case '4mabudingwei': data = '四码不定位'; break;
      case '5mabudingwei': data = '五码不定位'; break;
      case 'caihezhi': data = '猜和值'; break;
      case 'longhudou': data = '龙虎斗'; break;

      //玩法组
      case 'BDW': data = '不定位'; break;
      case 'DWD': data = '定位胆'; break;
      case 'EX': data = '二星'; break;
      case 'H3': data = '后三'; break;
      case 'LH': data = '龙虎'; break;
      case 'QW': data = '趣味'; break;
      case 'SX': data = '四星'; break;
      case 'Z3': data = '中三'; break;
      case 'Z3': data = '中三'; break;
      default: 
      data=value;
      break;
    }
    return data;
  }
}
