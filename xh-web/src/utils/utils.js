import queryString from 'query-string';

/**
 * 等待
 * @param time
 * @returns {Promise}
 */
export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * 分转元
 * @param moneyString
 * @param mark
 * @returns {*}
 */
export const formatMoney = (moneyString = '0', mark = 100) => {
  try {
    const moneyNumber = parseFloat(moneyString);
    if (typeof moneyNumber === 'number' && typeof mark === 'number') {
      return parseFloat(moneyNumber / mark).toFixed(2);
    }
    return 0;
  } catch (e) {
    console.log('error', e); // 缺失全局异常处理
    return 0;
  }
};

/**
 * 对象转键值对
 * @param json
 * @returns {*|number}
 */
export function jsonToQueryString(json = {}) {
  return queryString.stringify(json);
}

/**
 * 键值对转对象
 * @param json
 * @returns {*|number}
 */
export function queryStringToJson(qs = {}) {
  return queryString.parse(qs);
}