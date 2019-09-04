import { environment } from '../environments/environment';
import { ApiService } from '../api/api.service';
import { NzModalService } from 'ng-zorro-antd';
export class Utils {
  static httpIri: string;
  static page_size = 15;
  static image_upload_iri_help: string = '/api/sys/upload';
  static image_upload_iri_announcement: string;
  static acl_route_list: Array<any> = [];
  static acl_id_list: Array<any> = [];
  static white_route: Array<any> = [
    '/personal/personal_center',
    '/operasyon/operasyon-setting',
    '/passport/login'
  ];
  static isDevelop: boolean = false;
  static issue_format: Array<any> = [
    {
      value: 'C6',
      eg: '735876'
    },
    {
      value: 'C7',
      eg: '0294608'
    },
    {
      value: 'Y|T3',
      eg: '2019001'
    },
    {
      value: 'y|T3',
      eg: '19001'
    },
    {
      value: 'ymd|N2',
      eg: '19070801'
    },
    {
      value: 'ymd|N3',
      eg: '190701001'
    },
    {
      value: 'ymd|N4',
      eg: '1907080001'
    },
    {
      value: 'Ymd-|N2',
      eg: '2019070801'
    },
    {
      value: 'Ymd|N3',
      eg: '20190708001'
    },
    {
      value: 'Ymd|N4',
      eg: '201907080001'
    }
  ];

  constructor(

    public Api: ApiService
  ) {

  }

  /**
   *httpIri
   *
   * @static
   * @returns
   * @memberof Utils
   */
  static GethttpIri() {
    //   if (this.isDevelop) {
    //   // this.httpIri = 'http://www.lottery.com';
    //   this.httpIri = 'http://local.multisites.com';
    // } else {

    //   this.httpIri = 'http://api.9170ttt.com';
    // }
    this.httpIri = environment.apiBaseUrl
    return this.httpIri;
  }

  static get_upload_iri(type) {
    if (type === 'help') {
      return environment.apiBaseUrl + this.image_upload_iri_help;

    } else if (type === 'announcement') {
      return environment.apiBaseUrl + this.image_upload_iri_announcement;

    }

  }
  static GetFreezeType(num) {
    let type;
    switch (num) {
      case 0:
        type = '开放用户'
        break;
      case 1:
        type = '禁止登录'
        break;
      case 2:
        type = '禁止投注'
        break;
      case 3:
        type = '禁止提现'
        break;
      case 4:
        type = '禁止资金操作'
        break;
    }

    return type;
  }


  /**
   * 金额输入框验证
   */
  static account_check(value, max_num?) {
    //正整数，小于最大限额
    let prize = Number(value);
    prize = parseInt(String(prize));
    if (max_num && prize > max_num) {
      prize = max_num;
    }
    if (prize <= 0) {
      prize = null;
    }
    return prize ? prize : null;
  }

  /**
   * 验证是否合法http链接
   */
  static link_check(value) {
    var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(reg);
    if (objExp.test(value)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *处理文本中img请求头
   *
   * @static
   * @param {*} str
   * @memberof Utils
   */
  static get_img_iri(str, type) {
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var arr = str.match(imgReg);  // arr 为包含所有img标签的数组
    var st = str;
    var pic_path = '';
    var pic_name = '';
    if (arr) {
      for (var i = 0; i < arr.length; i++) {
        var src = arr[i].match(srcReg);
        if (type == 'remove') {
          var replace_src = src[1].replace(Utils.httpIri, '')
          st = st.replace(src[1], replace_src);
          pic_path += replace_src + '|';
          pic_name += replace_src.split('/')[replace_src.split('/').length - 1] + '|';
        } else if (type == 'add') {
          st = st.replace(src[1], Utils.httpIri + src[1]);
        }
      }
    }
    return {
      content: st,
      pic_path: pic_path.substring(0, pic_path.length - 1),
      pic_name: pic_name.substring(0, pic_name.length - 1),
    }
  }

  /**
   * GmT转时间格式 
   * */
  static change_date(time, type) {
    let date = new Date(time);
    let mouth = (date.getMonth() + 1) < 10 ? '0' + ((date.getMonth() + 1)) : (date.getMonth() + 1);
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    let Str
    if (type == 'date') {
      Str = date.getFullYear() + '-' + mouth + '-' + day;
    } else if (type == 'time') {
      Str = date.getFullYear() + '-' + mouth + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }

    return Str;
  }

  // 时间转换
  static formatTime(obj: any, format = 'YYYY-MM-DD HH:MM:SS') {
    if (!obj) {
      return;
    }
    if (typeof obj === 'string') {
      obj = Number(obj);
    }
    if (String(new Date(obj).getTime()).length < 13) {
      obj = new Date(obj).getTime() * 1000;
    }
    let date: any = new Date(obj);
    let date2: any = date.toLocaleDateString().split('/');
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let seconds: any = date.getSeconds();
    if (+date2[1] < 10) {
      date2[1] = '0' + date2[1]
    }
    if (+date2[2] < 10) {
      date2[2] = '0' + date2[2]
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (+minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    let dateDay: any = date2.join('-');
    if (format === 'YYYY-MM-DD') {
      return dateDay;
    } else if (format === 'HH:MM:SS') {
      return hours + ":" + minutes + ':' + seconds
    } else if (format === 'YYYY-MM-DD HH:MM:SS') {
      return dateDay + ' ' + hours + ":" + minutes + ':' + seconds
    }
  }
  // 限制 只输入数字 包括不能输入字符和小数点
  static number(str: any, float = false) {
    // float = true 可以输入小数点
    str = String(str);
    if (float) {
      return str.replace(/[^\d.]/g, '').replace(/^0{1,}/g, '');
    }
    else {
      return str.replace(/[^\d]/g, '').replace(/^0{-1,}/g, '');
    }
  }
}
