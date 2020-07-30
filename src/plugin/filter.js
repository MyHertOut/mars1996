import moment from 'moment';

function formatNum3 (num) {
  num += '';
  if (!num.includes('.')) num += '.';
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) { return $1 + ','; }).replace(/\.$/, '');
}
const filters = {
  install (Vue, store) {
    /**
     * 格式化数据，如果小数点后长度大于8位则截取前8位
     * 如果8位都是0则只显示整数位
     */
    Vue.filter('demicrometer', num => {
      let strNum = `${num}`;
      if (strNum.indexOf('e') > -1 && strNum.indexOf('-') > -1) {
        // 如果是科学计数法
        strNum = num.toFixed();
      }
      if (!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(strNum)) {
        return num;
      }
      // 整数部分千分位处理
      let str = formatNum3(num);
      if (str.indexOf('e') > -1 && str.indexOf('-') > -1) {
        // 如果是科学计数法
        str = (+num).toFixed();
      }
      const decimalIndex = strNum.indexOf('.'); // 小数点所在位置
      let decimalNum = 0;
      if (decimalIndex > -1) {
        // 如果有小数
        // 小数点后的数字
        decimalNum = strNum.slice(decimalIndex + 1, strNum.length) || '';
        decimalNum =
          decimalNum.length > 8 ? decimalNum.slice(0, 8) : decimalNum;
        /*eslint-disable */
        // decimalNum = `${decimalNum}`.replace(/(?<=[1-9])0+\b/, ''); // 去掉小数点后末尾的0
        decimalNum = decimalNum == 0 || isNaN(decimalNum) ? '' : decimalNum;
      }
      let splitArr = str.split(',') || [];
      const intNum = str.slice(
        0,
        decimalIndex > -1 ? splitArr.length - 1 + decimalIndex : str.length
      );
      return intNum + (decimalNum ? '.' + decimalNum : '');
    });

    Vue.filter("dateFormat", (time, format = "YYYY-MM-DD HH:mm:ss") => {
      if (!time) return "";
      return moment(new Date(time)).format(format);
    });
    Vue.filter("integer", num => {
      return num.toString().replace(/[^\d]/g, "");
    });

    Vue.directive("permissions", {
      inserted(el, binding) {
        const userFunction = store.getters.userInfo.functions;
        if (
          userFunction &&
          !userFunction.filter(v => v.functionCode === binding.value)[0]
        ) {
          el.remove();
        }
      }
    });
  }
};
export default filters;
