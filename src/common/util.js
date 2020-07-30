import moment from 'moment';
import md5 from 'md5';

/**
 * Chinese
 */
export const ZH_CN = 'zh-CN';

/**
 * English
 */
export const EN_GB = 'en-GB';
// Secondary Password regular expression
/* eslint-disable */
export const secondaryPwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*\(\)_\-+=\[\]:;\?,.])[A-Za-z\d!@#$&*\(\)_\-+=\[\]:;\?,.]{8,}/;
// 大于0的整数或者小数
export const numberExcludeZero = /^[1-9]\d*$|^\d+\.\d+$/;
// 大于0的整数
export const integersExcludeZero = /^[1-9]\d*$/;
// 大于0的整数或者小数（小数不超过8位）
export const numberExcludeZeroEight = /^(([1-9]\d*)|0)\.?(\d{1,8})?$/; // /^[1-9]\d*$|^\d+\.\d{1,8}$/;
// 不能包含中文
export const notChineseReg = /^[^\u4e00-\u9fa5]+$/;
// Alphabetic or numeric Spaces
export const letterNumberSpacesReg = /^[A-Za-z0-9\s]+$/;
// Case letters and Numbers and specify special symbols
export const userIdLetterNumberReg = /^[A-Za-z0-9-_.]+$/;
/**
 * localStorage language Key
 */
export const LOCAL_STORAGE_LANG = '_lang';

export const LOCAL_STORAGE_TOKEN = 'user_token';

export const LOCAL_STORAGE_SYSTEM = 'system_config';
// trade Multiple address selection
export const LOCAL_STORAGE_TRADEADDRESS = 'TRADE_AddRESS';
// balance Multiple address selection
export const LOCAL_STORAGE_BALANCEADDRESS = 'BALANCE_AddRESS';
// issuance-securities Multiple address selection
export const LOCAL_STORAGE_SECURITIESADDRESS = 'SECURITIES_RESS';
// issuance-settlementToken Multiple address selection
export const LOCAL_STORAGE_SETTLETOKENADDRESS = 'SETTLETOKEN_RESS';

// wallet状态
export const walletStatusDesc = ['Pending Wallet', 'Wallet Created', 'Wallet Failed'];

// account list 状态
export const accountListStatusDesc = ['Inactive', 'Suspend', 'Active'];

// account状态
export const accountStatusDesc = ['Process', 'Success', 'Failed']; // ['Inactive', 'Suspend', 'Active'];

/**
 * 返回数字小数点后有多少位，如果超过8位则只显示8位
 * @param {*} num 数字
 */
export const getDecimalDigits = (num) => {
  const str = `${num}`;
  const index = str.indexOf('.');
  if (index === -1) { // 如果没有小数点
    return 0;
  }
  const length = str.slice(index + 1, str.length).length;
  return length > 8 ? 8 : length;
};
/**
 * format date
 * @param {*} time
 * @param {*} format
 */
export const formatDate = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '';
  if (typeof time === 'number') {
    return moment(time).format(format);
  }
  return moment(new Date(time)).format(format);
};
/**
 * Remove all commas
 * return string
 * @param {*} str
 */
export const removeComma = (str) => {
  return str ? `${str}`.replace(/,/g, '') : '';
};
/**
 * request tips
 */
export const notify = {
  any: 'ANY',
  success: 'SUCCESS',
  error: 'ERROR'
};

// getLanguage default English
export const getLang = () => {
  const localStorageLang = localStorage.getItem(LOCAL_STORAGE_LANG);
  let lang = localStorageLang;
  if (!localStorageLang) {
    // lang = navigator.language;
    lang = EN_GB;
  }
  return lang;
};

export const convertBase64UrlToBlob = (urlData) => {
  const bytes = window.atob(urlData.split(',')[1]);
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
};

/**
 * 返回加密对
 */
export const getEncryptPair = () => {
  return {
    accesskey: 'webAccessKey',
    secretkey: 'webSecretKey'
  };
};

/**
 * 将对象序列化为key1=value1&key2=&value2
 * 字符串,key按字符串排序，返回MD5签名值
 * @param { object } params
 * @return { string } MD5签名值
 */
export const encrypt = (params) => {
  let arr = [];

  for (const key in params) {
    arr.push(key);
  }
  arr.sort();
  arr = arr.map(key => {
    return key + '=' + params[key];
  });
  return md5(arr.join('&'));
};
/**
 * deboundce
 * @param {*} cb
 */
let timer = null;
export const deboundce = (fn, wait = 500) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(fn, wait);
  // let timer;
  // return () => {
  //   if (timer) clearTimeout(timer);

  //   timer = setTimeout(fn, wait);
  // };
};
/**
 * save the address of the transaction selection
 * @param {*} data
 */
export const setTradeaddressStorage = (key, data) => {
  if (!data) return;
  localStorage.setItem(key, JSON.stringify(data));
};
/**
 * get the address of the transaction selection
 * @param {*} data
 */
export const getTradeaddressStorage = (key) => {
  const data = localStorage.getItem(key) || '{}';
  return JSON.parse(data);
};
// Encrypt second password
export const encryptSecondPwd = (pwd) => {
  return pwd ? md5(pwd).toUpperCase() : '';
};

// 获取距离结束时间有多少天
export const changeTimeStamp = (time, isCh) => {
  var distancetime = (new Date(time)) - (new Date());
  if (distancetime > 0) {
    // 如果大于0.说明尚未到达截止时间
    var ss = Math.floor(distancetime % 1000).toString();
    var ms = Number(ss.substring(0, 2));
    var sec = Math.floor(distancetime / 1000 % 60);
    var min = Math.floor(distancetime / 1000 / 60 % 60);
    var hour = Math.floor(distancetime / 1000 / 60 / 60 % 24);
    var days = Math.floor(distancetime / 1000 / 60 / 60 / 24);
    if (ms < 100 && ms === 0) {
      ms = '0' + ms;
    }
    if (sec < 10 && sec !== 0) {
      sec = '0' + sec;
    }
    if (min < 10 && min !== 0) {
      min = '0' + min;
    }
    if (hour < 10 && hour !== 0) {
      hour = '0' + hour;
    }
    return (days + ' day ' + hour + ' hour ' + min + ' minute ' + sec + ' second');
  } else {
    // 若否，就是已经到截止时间了
    return ''
  }
}

/*
* 判断obj是否为一个整数
*/
function isInteger(obj) {
  return Math.floor(obj) === obj
}

/*
* 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
* @param floatNum {number} 小数
* @return {object}
*   {times:100, num: 314}
*/
function toInteger(floatNum) {
  var ret = {times: 1, num: 0}
  if (isInteger(floatNum)) {
    ret.num = floatNum;
    return ret;
  }
  var strfi = floatNum + '';
  var dotPos = strfi.indexOf('.');
  var len = strfi.substr(dotPos+1).length;
  var times = Math.pow(10, len);
  var intNum = Number(floatNum.toString().replace('.',''));
  ret.times = times;
  ret.num = intNum;
  return ret;
}

/*
* @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
*/
export const operationNumber = (a, b, op) => {
  let arr = [toInteger(a), toInteger(b)];
  let max = 0;
  let res = 0;
  if ((''+ a).indexOf('.') === -1) {
    arr.forEach(val => {
      if (max < val.times) {
        max = val.times;
      }
    });
  } else {
    max = arr[0].times * arr[1].times;
  }
  if (op === 'add') {
    res = arr[0].num + arr[1].num;
  } else if (op === 'subtract') {
    res = arr[0].num - arr[1].num;
  } else if (op === 'multiply') {
    res = arr[0].num * arr[1].num;
  } else if (op === 'divide') {
    res = arr[0].num / arr[1].num;
  }
  return res / max;
}

/*
* 保留小数点后几位, 位数不够补0
* @param num {string} 需转换的数
* @param digits {string} 保留小数位数
*/
export const toFixeds = (num, digits, isZero = true) => {
  let arr = ('' + num).split('.');
  let res = '';
  let zero = [];
  if (isZero) {
    for (let i = 0; i < digits; i++) {
      zero.push(0);
    }
    if (arr[1]) {
      while (arr[1].length < digits) {
        arr[1] += '0';
      }
      res = arr[0] + '.' + arr[1].substr(0, digits);
    } else {
      res = arr[0] + '.' + zero.join('');
    }
  } else {
    if (arr[1]) {
      res = arr[0] + '.' + arr[1].substr(0, digits);
    } else {
      res = arr[0];
    }
  }
  return res;
}

/*
* 自然月计算发行每期日期
* @param data {date} 开始时间
* @param type {string} 0 季度， 1 半年， 2 一年
* @param periods {number} 期数
*/
export const calculatePeriod = (data, type, periods) => {
  let res = [];
  if (periods) {
    let tempTime = data;
    let year = tempTime.getFullYear();
    let month = tempTime.getMonth() + 1;
    let day = tempTime.getDate();
    let hours = tempTime.getHours();
    let minutes = tempTime.getMinutes();
    let seconds = tempTime.getSeconds();
    let frequencyType = [{ type: 0, num: 3 }, { type: 1, num: 6 }, { type: 2, num: 12 }].filter(v => parseInt(v.type) === parseInt(type))[0];
    for (let i = 0; i < periods; i++) {
      if ((month + frequencyType.num) > 12) {
        month = (month + frequencyType.num) - 12;
        year++;
      } else {
        month += frequencyType.num;
      }
      if (day > new Date(year, month, 0).getDate()) {
        day = new Date(year, month, 0).getDate();
      } else {
        day = tempTime.getDate();
      }
      res.push({
        periods: (i + 1) + '/' + periods,
        time: moment(new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)).format('YYYY-MM-DD HH:mm:ss')
      });
    }
  }
  return res;
}